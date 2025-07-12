import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // optimizeDeps: {
  //   include: ['pdfjs-dist/build/pdf.worker.entry'],
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   build: {
    rollupOptions: {
      external: ["pdfjs-dist/build/pdf.worker.min.js"], // important for Vercel
    },
  },
server: {
    fs: {
      allow: [".."],
    },
  }

});
