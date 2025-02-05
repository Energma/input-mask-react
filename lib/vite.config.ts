import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from "vite-plugin-dts";
import { resolve, dirname } from "path";

// ??? wtf ???
// Use import.meta.url to get the directory name in a Vite/ESM-friendly way
const __dirname = dirname(new URL(import.meta.url).pathname);
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: "dist"
    })

  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "InputMaskReact", 
      formats: ["es", "umd"], 
      fileName: (format) =>
        `input-mask-react.${format === "es" ? "es.js" : "umd.js"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        }
      }
    }
  }
})
