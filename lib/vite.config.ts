import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from "vite-plugin-dts";
import path from "path";


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: "./dist"
    })

  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "./index.tsx"),
      name: "@energma/input-mask-react", 
      formats: ["es", "umd"], 

      fileName: (format) => `input-mask-react.${format}.js`,
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
