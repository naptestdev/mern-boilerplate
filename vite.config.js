import { defineConfig } from "vite";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), viteCommonjs()],
});