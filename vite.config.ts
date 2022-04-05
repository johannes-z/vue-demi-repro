import * as path from 'path';

import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';

export default defineConfig({
  plugins: [createVuePlugin()],
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'MyLib',
      formats: ['umd'],
      fileName: (format) => 'mylib.js',
    },
    rollupOptions: {
      external: ['vue', '@vue/composition-api'],
      output: {
        globals: {
          vue: 'Vue',
          '@vue/composition-api': 'VueCompositionAPI',
        },
      },
    },
  },
});
