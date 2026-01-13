import { resolve } from "node:path";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    browser_specific_settings: {
      gecko: {
        id: "passgen@pyyupsk.github.io",
        strict_min_version: "142.0",
        // @ts-expect-error data_collection_permissions is a new Firefox manifest property not yet in WXT types
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
    description: "Generate strong, secure passwords for registration forms",
    name: "PassGen",
    permissions: ["activeTab", "clipboardWrite"],
  },
  modules: ["@wxt-dev/module-vue"],
  srcDir: "src",
  vite: () => ({
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  }),
});
