import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["react-syntax-highlighter"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@lib': path.resolve(__dirname, './lib')
    },
  },
  ssr: {
    noExternal: ["react-syntax-highlighter"],
  },
})