import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      utils: path.resolve(__dirname, "src/utils"),
      hook: path.resolve(__dirname, "src/hook"),
      constants: path.resolve(__dirname, "src/constants"),
      api: path.resolve(__dirname, "src/api"),
      types: path.resolve(__dirname, "src/types"),
      schema: path.resolve(__dirname, "src/schema"),
      store: path.resolve(__dirname, "src/store"),
    },
  },
});
