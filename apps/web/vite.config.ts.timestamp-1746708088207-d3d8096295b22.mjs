// vite.config.ts
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy
} from "file:///C:/Users/Burak%20Can/Documents/GitHub/supermemory/node_modules/@remix-run/dev/dist/index.js";
import adapter from "file:///C:/Users/Burak%20Can/Documents/GitHub/supermemory/node_modules/@hono/vite-dev-server/dist/adapter/cloudflare.js";
import serverAdapter from "file:///C:/Users/Burak%20Can/Documents/GitHub/supermemory/node_modules/hono-remix-adapter/dist/vite-plugin.js";
import path from "path";
import { flatRoutes } from "file:///C:/Users/Burak%20Can/Documents/GitHub/supermemory/node_modules/remix-flat-routes/dist/index.js";
import { defineConfig } from "file:///C:/Users/Burak%20Can/Documents/GitHub/supermemory/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///C:/Users/Burak%20Can/Documents/GitHub/supermemory/node_modules/vite-tsconfig-paths/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Burak Can\\Documents\\GitHub\\supermemory\\apps\\web";
var _plugins = [
  remixCloudflareDevProxy({
    persist: true
  }),
  remix({
    future: {
      v3_fetcherPersist: true,
      v3_relativeSplatPath: true,
      v3_throwAbortReason: true,
      unstable_optimizeDeps: true
    },
    ignoredRouteFiles: ["**/*"],
    routes: async (defineRoutes) => {
      return flatRoutes("routes", defineRoutes);
    }
  }),
  serverAdapter({
    adapter,
    entry: "server/index.ts"
  }),
  tsconfigPaths()
];
var vite_config_default = defineConfig((mode) => {
  return {
    plugins: _plugins,
    resolve: {
      alias: {
        ...mode.mode === "development" && {
          postgres: path.resolve(__vite_injected_original_dirname, "../../node_modules/postgres/src/index.js")
        }
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".css"]
    },
    ssr: {
      target: "node",
      noExternal: mode.mode === "development" ? ["@udecode/plate-math", "katex", "prismjs", "react-tweet", "drizzle-orm"] : ["@udecode/plate-math", "katex", "prismjs"]
    },
    css: {
      modules: {
        scopeBehaviour: "local",
        generateScopedName: "[name]__[local]___[hash:base64:5]",
        localsConvention: "camelCaseOnly"
      }
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
          if (warning.code === "IGNORED_BARE_IMPORT") return;
          warn(warning);
        },
        onLog(level, log, handler) {
          if (log.cause?.message?.includes("Can't resolve original location of error.")) return;
          handler(level, log);
        }
      }
    },
    optimizeDeps: {
      include: ["react-tweet"]
    },
    publicDir: "public"
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCdXJhayBDYW5cXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxzdXBlcm1lbW9yeVxcXFxhcHBzXFxcXHdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQnVyYWsgQ2FuXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcc3VwZXJtZW1vcnlcXFxcYXBwc1xcXFx3ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0J1cmFrJTIwQ2FuL0RvY3VtZW50cy9HaXRIdWIvc3VwZXJtZW1vcnkvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQge1xyXG5cdHZpdGVQbHVnaW4gYXMgcmVtaXgsXHJcblx0Y2xvdWRmbGFyZURldlByb3h5Vml0ZVBsdWdpbiBhcyByZW1peENsb3VkZmxhcmVEZXZQcm94eSxcclxufSBmcm9tIFwiQHJlbWl4LXJ1bi9kZXZcIjtcclxuXHJcbmltcG9ydCBhZGFwdGVyIGZyb20gXCJAaG9uby92aXRlLWRldi1zZXJ2ZXIvY2xvdWRmbGFyZVwiO1xyXG5pbXBvcnQgc2VydmVyQWRhcHRlciBmcm9tIFwiaG9uby1yZW1peC1hZGFwdGVyL3ZpdGVcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZmxhdFJvdXRlcyB9IGZyb20gXCJyZW1peC1mbGF0LXJvdXRlc1wiO1xyXG5pbXBvcnQgeyBVc2VyQ29uZmlnLCBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xyXG5cclxuY29uc3QgX3BsdWdpbnMgPSBbXHJcblx0cmVtaXhDbG91ZGZsYXJlRGV2UHJveHkoe1xyXG5cdFx0cGVyc2lzdDogdHJ1ZSxcclxuXHR9KSxcclxuXHRyZW1peCh7XHJcblx0XHRmdXR1cmU6IHtcclxuXHRcdFx0djNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXHJcblx0XHRcdHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxyXG5cdFx0XHR2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxyXG5cdFx0XHR1bnN0YWJsZV9vcHRpbWl6ZURlcHM6IHRydWUsXHJcblx0XHR9LFxyXG5cdFx0aWdub3JlZFJvdXRlRmlsZXM6IFtcIioqLypcIl0sXHJcblx0XHRyb3V0ZXM6IGFzeW5jIChkZWZpbmVSb3V0ZXMpID0+IHtcclxuXHRcdFx0cmV0dXJuIGZsYXRSb3V0ZXMoXCJyb3V0ZXNcIiwgZGVmaW5lUm91dGVzKTtcclxuXHRcdH0sXHJcblx0fSksXHJcblx0c2VydmVyQWRhcHRlcih7XHJcblx0XHRhZGFwdGVyLFxyXG5cdFx0ZW50cnk6IFwic2VydmVyL2luZGV4LnRzXCIsXHJcblx0fSksXHJcblx0dHNjb25maWdQYXRocygpLFxyXG5dO1xyXG4vLyBfcGx1Z2lucy51bnNoaWZ0KE1pbGxpb25MaW50LnZpdGUoKSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKG1vZGUpID0+IHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0cGx1Z2luczogX3BsdWdpbnMsXHJcblx0XHRyZXNvbHZlOiB7XHJcblx0XHRcdGFsaWFzOiB7XHJcblx0XHRcdFx0Li4uKG1vZGUubW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIHtcclxuXHRcdFx0XHRcdHBvc3RncmVzOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Z3Jlcy9zcmMvaW5kZXguanNcIiksXHJcblx0XHRcdFx0fSksXHJcblx0XHRcdH0sXHJcblx0XHRcdGV4dGVuc2lvbnM6IFtcIi5tanNcIiwgXCIuanNcIiwgXCIudHNcIiwgXCIuanN4XCIsIFwiLnRzeFwiLCBcIi5qc29uXCIsIFwiLmNzc1wiXSxcclxuXHRcdH0sXHJcblx0XHRzc3I6IHtcclxuXHRcdFx0dGFyZ2V0OiBcIm5vZGVcIixcclxuXHRcdFx0bm9FeHRlcm5hbDpcclxuXHRcdFx0XHRtb2RlLm1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIlxyXG5cdFx0XHRcdFx0PyBbXCJAdWRlY29kZS9wbGF0ZS1tYXRoXCIsIFwia2F0ZXhcIiwgXCJwcmlzbWpzXCIsIFwicmVhY3QtdHdlZXRcIiwgXCJkcml6emxlLW9ybVwiXVxyXG5cdFx0XHRcdFx0OiBbXCJAdWRlY29kZS9wbGF0ZS1tYXRoXCIsIFwia2F0ZXhcIiwgXCJwcmlzbWpzXCJdLFxyXG5cdFx0fSxcclxuXHRcdGNzczoge1xyXG5cdFx0XHRtb2R1bGVzOiB7XHJcblx0XHRcdFx0c2NvcGVCZWhhdmlvdXI6IFwibG9jYWxcIixcclxuXHRcdFx0XHRnZW5lcmF0ZVNjb3BlZE5hbWU6IFwiW25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdXCIsXHJcblx0XHRcdFx0bG9jYWxzQ29udmVudGlvbjogXCJjYW1lbENhc2VPbmx5XCIsXHJcblx0XHRcdH0sXHJcblx0XHR9LFxyXG5cdFx0YnVpbGQ6IHtcclxuXHRcdFx0cm9sbHVwT3B0aW9uczoge1xyXG5cdFx0XHRcdG9ud2Fybih3YXJuaW5nLCB3YXJuKSB7XHJcblx0XHRcdFx0XHRpZiAod2FybmluZy5jb2RlID09PSBcIlVOVVNFRF9FWFRFUk5BTF9JTVBPUlRcIikgcmV0dXJuO1xyXG5cdFx0XHRcdFx0aWYgKHdhcm5pbmcuY29kZSA9PT0gXCJJR05PUkVEX0JBUkVfSU1QT1JUXCIpIHJldHVybjtcclxuXHRcdFx0XHRcdHdhcm4od2FybmluZyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRvbkxvZyhsZXZlbCwgbG9nLCBoYW5kbGVyKSB7XHJcblx0XHRcdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0XHRcdFx0XHRpZiAobG9nLmNhdXNlPy5tZXNzYWdlPy5pbmNsdWRlcyhcIkNhbid0IHJlc29sdmUgb3JpZ2luYWwgbG9jYXRpb24gb2YgZXJyb3IuXCIpKSByZXR1cm47XHJcblx0XHRcdFx0XHRoYW5kbGVyKGxldmVsLCBsb2cpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHR9LFxyXG5cdFx0b3B0aW1pemVEZXBzOiB7XHJcblx0XHRcdGluY2x1ZGU6IFtcInJlYWN0LXR3ZWV0XCJdLFxyXG5cdFx0fSxcclxuXHRcdHB1YmxpY0RpcjogXCJwdWJsaWNcIixcclxuXHR9IHNhdGlzZmllcyBVc2VyQ29uZmlnO1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VztBQUFBLEVBQzNXLGNBQWM7QUFBQSxFQUNkLGdDQUFnQztBQUFBLE9BQzFCO0FBRVAsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGtCQUFrQjtBQUMzQixTQUFxQixvQkFBNkI7QUFDbEQsT0FBTyxtQkFBbUI7QUFWMUIsSUFBTSxtQ0FBbUM7QUFZekMsSUFBTSxXQUFXO0FBQUEsRUFDaEIsd0JBQXdCO0FBQUEsSUFDdkIsU0FBUztBQUFBLEVBQ1YsQ0FBQztBQUFBLEVBQ0QsTUFBTTtBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ1AsbUJBQW1CO0FBQUEsTUFDbkIsc0JBQXNCO0FBQUEsTUFDdEIscUJBQXFCO0FBQUEsTUFDckIsdUJBQXVCO0FBQUEsSUFDeEI7QUFBQSxJQUNBLG1CQUFtQixDQUFDLE1BQU07QUFBQSxJQUMxQixRQUFRLE9BQU8saUJBQWlCO0FBQy9CLGFBQU8sV0FBVyxVQUFVLFlBQVk7QUFBQSxJQUN6QztBQUFBLEVBQ0QsQ0FBQztBQUFBLEVBQ0QsY0FBYztBQUFBLElBQ2I7QUFBQSxJQUNBLE9BQU87QUFBQSxFQUNSLENBQUM7QUFBQSxFQUNELGNBQWM7QUFDZjtBQUdBLElBQU8sc0JBQVEsYUFBYSxDQUFDLFNBQVM7QUFDckMsU0FBTztBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLE1BQ1IsT0FBTztBQUFBLFFBQ04sR0FBSSxLQUFLLFNBQVMsaUJBQWlCO0FBQUEsVUFDbEMsVUFBVSxLQUFLLFFBQVEsa0NBQVcsMENBQTBDO0FBQUEsUUFDN0U7QUFBQSxNQUNEO0FBQUEsTUFDQSxZQUFZLENBQUMsUUFBUSxPQUFPLE9BQU8sUUFBUSxRQUFRLFNBQVMsTUFBTTtBQUFBLElBQ25FO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSixRQUFRO0FBQUEsTUFDUixZQUNDLEtBQUssU0FBUyxnQkFDWCxDQUFDLHVCQUF1QixTQUFTLFdBQVcsZUFBZSxhQUFhLElBQ3hFLENBQUMsdUJBQXVCLFNBQVMsU0FBUztBQUFBLElBQy9DO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSixTQUFTO0FBQUEsUUFDUixnQkFBZ0I7QUFBQSxRQUNoQixvQkFBb0I7QUFBQSxRQUNwQixrQkFBa0I7QUFBQSxNQUNuQjtBQUFBLElBQ0Q7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNOLGVBQWU7QUFBQSxRQUNkLE9BQU8sU0FBUyxNQUFNO0FBQ3JCLGNBQUksUUFBUSxTQUFTLHlCQUEwQjtBQUMvQyxjQUFJLFFBQVEsU0FBUyxzQkFBdUI7QUFDNUMsZUFBSyxPQUFPO0FBQUEsUUFDYjtBQUFBLFFBQ0EsTUFBTSxPQUFPLEtBQUssU0FBUztBQUUxQixjQUFJLElBQUksT0FBTyxTQUFTLFNBQVMsMkNBQTJDLEVBQUc7QUFDL0Usa0JBQVEsT0FBTyxHQUFHO0FBQUEsUUFDbkI7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ2IsU0FBUyxDQUFDLGFBQWE7QUFBQSxJQUN4QjtBQUFBLElBQ0EsV0FBVztBQUFBLEVBQ1o7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
