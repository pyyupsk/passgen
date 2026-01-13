import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    description: "Generate strong, secure passwords for registration forms",
    name: "PassGen",
    permissions: ["activeTab", "clipboardWrite"],
  },
  modules: ["@wxt-dev/module-vue"],
  srcDir: "src",
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  }),
});
