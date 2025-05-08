import {
  WorkflowEntrypoint,
  WorkflowStep,
  WorkflowEvent,
} from "cloudflare:workers";
import { Env, WorkflowParams } from "../types";
import { fetchContent } from "../utils/fetchers";
import chunkText from "../utils/chunkers";
import { database, eq, inArray } from "@supermemory/db";
import {
  ChunkInsert,
  contentToSpace,
  documents,
  spaces,
} from "@supermemory/db/schema";
import { embedMany } from "ai";
import { openai } from "../providers";
import { chunk } from "@supermemory/db/schema";
import { NonRetryableError } from "cloudflare:workflows";

// TODO: handle errors properly here.

export class ContentWorkflow extends WorkflowEntrypoint<Env, WorkflowParams> {
  async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep) {
    // Step 0: Check if user has reached memory limit
    await step.do("check memory limit", async () => {
      const existingMemories = await database(
        this.env.HYPERDRIVE.connectionString
      )
        .select()
        .from(documents)
        .where(eq(documents.userId, event.payload.userId));

      if (existingMemories.length >= 2000) {
        await database(this.env.HYPERDRIVE.connectionString)
          .delete(documents)
          .where(eq(documents.uuid, event.payload.uuid));
        throw new NonRetryableError(
          "You have reached the maximum limit of 2000 memories"
        );
      }
    });

    // Step 1: Get and format the content.
    const rawContent =
      event.payload.prefetched ??
      (await step.do(
        "fetch content",
        async () => await fetchContent(event.payload, this.env, step)
      ));

    // NEW CHECK: Check for error in rawContent
    if (rawContent.error) {
      await step.do("update document with error", async () => {
        await database(this.env.HYPERDRIVE.connectionString)
          .update(documents)
          .set({
            isSuccessfullyProcessed: false,
            errorMessage: rawContent.error, // Save the error message
            updatedAt: new Date(),
          })
          .where(eq(documents.uuid, event.payload.uuid));
      });
      throw new NonRetryableError(`Failed to process content due to: ${rawContent.error}`);
    }

    // check that the rawcontent is not too big
    if (rawContent.contentToVectorize.length > 100000) {
      await database(this.env.HYPERDRIVE.connectionString)
        .delete(documents)
        .where(eq(documents.uuid, event.payload.uuid));
      throw new NonRetryableError("The content is too big (maximum 20 pages)");
    }

    const chunked = await step.do("chunk content", async () =>
      chunkText(rawContent.contentToVectorize, 768)
    );

    // Define variables to hold step results in a wider scope
    let documentResult: any; // Tipini daha sonra iyileştirebiliriz, şimdilik any
    let openaiEmbeddingsResult: number[][];

    // Step 2: Create the document in the database.
    documentResult = await step.do("create document", async () => {
      try {
        // First check if document exists
        const existingDoc = await database(this.env.HYPERDRIVE.connectionString)
          .select()
          .from(documents)
          .where(eq(documents.uuid, event.payload.uuid))
          .limit(1);

        const doc = await database(this.env.HYPERDRIVE.connectionString)
          .insert(documents)
          .values({
            userId: event.payload.userId,
            type: event.payload.type,
            uuid: event.payload.uuid,
            ...(event.payload.url && { url: event.payload.url }),
            title: rawContent.title,
            content: rawContent.contentToSave,
            description:
              "description" in rawContent
                ? (rawContent.description ?? "")
                : (event.payload.prefetched?.description ?? undefined),
            ogImage:
              "image" in rawContent
                ? (rawContent.image ?? "")
                : (event.payload.prefetched?.ogImage ?? undefined),
            raw: rawContent.contentToVectorize,
            isSuccessfullyProcessed: false,
            updatedAt: new Date(),
            ...(event.payload.createdAt && {
              createdAt: new Date(event.payload.createdAt),
            }),
          })
          .onConflictDoUpdate({
            target: documents.uuid,
            set: {
              title: rawContent.title,
              content: rawContent.contentToSave,
              description:
                "description" in rawContent
                  ? (rawContent.description ?? "")
                  : (event.payload.prefetched?.description ?? undefined),
              ogImage:
                "image" in rawContent
                  ? (rawContent.image ?? "")
                  : (event.payload.prefetched?.ogImage ?? undefined),
              raw: rawContent.contentToVectorize,
              isSuccessfullyProcessed: false,
              updatedAt: new Date(),
            },
          })
          .returning();
        
        if (!doc || doc.length === 0) {
          throw new NonRetryableError(
            "Failed to create/update document - no document returned"
          );
        }
        return doc;
      } catch (error) {
        console.log("here's the error in create document step", error);
        // Check if error is a unique constraint violation
        if (
          error instanceof Error &&
          error.message.includes("document_url_user_id_idx")
        ) {
          // Document already exists for this user, stop workflow
          await database(this.env.HYPERDRIVE.connectionString)
            .delete(documents)
            .where(eq(documents.uuid, event.payload.uuid));
          throw new NonRetryableError("Document already exists for this user");
        }
        if (
          error instanceof Error &&
          error.message.includes("document_raw_user_idx")
        ) {
          await database(this.env.HYPERDRIVE.connectionString)
            .delete(documents)
            .where(eq(documents.uuid, event.payload.uuid));
          throw new NonRetryableError("The exact same document already exists");
        }
        throw error;
      }
    });
    
    const currentDocument = documentResult[0];

    // Step 3: Generate embeddings
    openaiEmbeddingsResult = await step.do("generate embeddings via openai", async () => {
      if (!chunked || chunked.length === 0) {
        return [];
      }
      const { embeddings } = await embedMany({
        model: openai(this.env).embedding('text-embedding-ada-002'),
        values: chunked,
      });
      if (!embeddings || embeddings.length !== chunked.length) {
        throw new NonRetryableError("Failed to generate embeddings or mismatch in length");
      }
      return embeddings;
    });

    // Step 4: Prepare chunk data
    const chunkInsertData: ChunkInsert[] = await step.do(
      "prepare chunk data",
      async () => {
        if (chunked.length === 0) return [];
        return chunked.map((textChunk, index) => ({
          documentId: currentDocument.id,
          textContent: textChunk,
          orderInDocument: index,
          embeddings: openaiEmbeddingsResult && openaiEmbeddingsResult[index] ? openaiEmbeddingsResult[index] : [],
        }));
      }
    );

    // Step 5: Insert chunks
    if (chunkInsertData.length > 0) {
      await step.do("insert chunks", async () =>
        database(this.env.HYPERDRIVE.connectionString).transaction(
          async (trx) => {
            await trx.insert(chunk).values(chunkInsertData);
          }
        )
      );
    }

    // step 6: add content to spaces
    if (event.payload.spaces) {
      await step.do("add content to spaces", async () => {
        await database(this.env.HYPERDRIVE.connectionString).transaction(
          async (trx) => {
            // First get the space IDs from the UUIDs
            const spaceIds = await trx
              .select({ id: spaces.id })
              .from(spaces)
              .where(inArray(spaces.uuid, event.payload.spaces ?? []));

            if (spaceIds.length === 0) {
              return;
            }

            // Then insert the content-space mappings using the actual space IDs
            await trx.insert(contentToSpace).values(
              spaceIds.map((space) => ({
                contentId: currentDocument.id,
                spaceId: space.id,
              }))
            );
          }
        );
      });
    }

    // Step 7: Mark the document as successfully processed
    await step.do("mark document as successfully processed", async () => {
      await database(this.env.HYPERDRIVE.connectionString)
        .update(documents)
        .set({
          isSuccessfullyProcessed: true,
        })
        .where(eq(documents.id, currentDocument.id));
    });
  }
}
