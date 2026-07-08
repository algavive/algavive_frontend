import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs-extra'; 

export default defineConfig({
  plugins: [
    react(),
{
  name: 'move-static',
  writeBundle() {
    const distPath = resolve(__dirname, 'dist');
    const staticPath = resolve(distPath, 'static');
    if (fs.existsSync(staticPath)) return;
    fs.mkdirSync(staticPath, { recursive: true });
    const files = fs.readdirSync(distPath).filter(f => f !== 'index.html' && f !== 'assets' && f !== 'static');
    for (const file of files) {
      const src = resolve(distPath, file);
      const dest = resolve(staticPath, file);
      fs.renameSync(src, dest);
    }
  }
}
  ],
  publicDir: 'static',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
});