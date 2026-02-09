import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.tmp-pack-test/**',
      '**/.tmp-sap-replay-bot-audit/**',
    ],
    deps: {
      inline: ['@angular/core', '@angular/forms', 'rxjs'],
    },
  },
  ssr: {
    noExternal: ['@angular/core', '@angular/forms', 'rxjs'],
  },
  resolve: {
    alias: [
      { find: 'app', replacement: path.resolve(__dirname, '../src/app') },
      {
        find: 'assets',
        replacement: path.resolve(__dirname, '../src/assets'),
      },
      {
        find: '@angular/core',
        replacement: path.resolve(__dirname, '../simulation/shims.ts'),
      },
      {
        find: '@angular/forms',
        replacement: path.resolve(__dirname, '../simulation/shims.ts'),
      },
      {
        find: /^rxjs\/operators$/,
        replacement: path.resolve(
          __dirname,
          '../node_modules/rxjs/operators/index.js',
        ),
      },
    ],
  },
});
