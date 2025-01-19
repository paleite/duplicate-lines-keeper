import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/"],
  clean: true,
  external: ["vscode"], // Do not bundle vscode
});
