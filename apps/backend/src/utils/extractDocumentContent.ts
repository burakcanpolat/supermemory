import * as mammoth from "mammoth";
import { NonRetryableError } from "cloudflare:workflows";
import { extractText } from 'unpdf';

interface DocumentContent {
  content: string;
  error?: string;
}

export const extractDocumentContent = async (
  url: string
): Promise<DocumentContent> => {
  try {
    const fileExtension = url.split(".").pop()?.toLowerCase();

    if (!fileExtension) {
      throw new Error("Invalid file URL");
    }

    console.log("file", fileExtension);

    switch (fileExtension) {
      case "pdf":
        return await extractPdfContent(url);
      case "md":
      case "txt":
        return await extractTextContent(url);
      case "doc":
      case "docx":
        return await extractWordContent(url);
      default:
        throw new NonRetryableError(`Unsupported file type: ${fileExtension}`);
    }
  } catch (error) {
    console.error("Error in extractDocumentContent:", error);
    return {
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred during content extraction",
    };
  }
};

async function extractPdfContent(url: string): Promise<DocumentContent> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF from URL: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    const { text: rawTextPages } = await extractText(arrayBuffer);

    const fullText = Array.isArray(rawTextPages) ? rawTextPages.join('\n') : (rawTextPages || "");

    if (fullText.trim() === '') {
       console.warn(`unpdf extracted empty text from ${url}`);
    }

    return { content: fullText };

  } catch (error) {
    console.error("Error extracting PDF content with unpdf:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to extract PDF content with unpdf";
    return {
      content: "",
      error: errorMessage,
    };
  }
}

async function extractTextContent(url: string): Promise<DocumentContent> {
  const response = await fetch(url);
  const text = await response.text();
  return { content: text };
}

async function extractWordContent(url: string): Promise<DocumentContent> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return { content: result.value };
}
