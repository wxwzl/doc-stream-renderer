import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [vue(), react(), dts({ outDir: 'dist', staticImport: true, insertTypesEntry: true })],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  build: {
    lib: {
      entry: {
        core: resolve(__dirname, 'src/core/index.ts'),
        react: resolve(__dirname, 'src/react/index.tsx'),
        vue: resolve(__dirname, 'src/vue3/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: [
        'vue',
        'react',
        'react/jsx-runtime',
        'react-dom',
        'docx',
        'partial-json',
        'lodash-es',
      ],
      output: {
        globals: {
          vue: 'Vue',
          react: 'React',
          'react-dom': 'ReactDOM',
          docx: 'docx',
          'docx-preview': 'docxPreview',
        },
      },
    },
  },
});
