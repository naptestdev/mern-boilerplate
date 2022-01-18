import { defineConfig } from "vite";
const path = require('path');
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";

export default defineConfig({
  plugins: [viteCommonjs()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'server.js'),
      name: 'MyLib',
      fileName: () => `server.js`
    }
  }
});