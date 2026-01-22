import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    deps: {
      inline: ['@angular/core', 'rxjs'],
    },
  },
  ssr: {
    noExternal: ['@angular/core', 'rxjs'],
  },
  resolve: {
    alias: [
      { find: 'app', replacement: path.resolve(__dirname, '../src/app') },
      {
        find: '@angular/core',
        replacement: path.resolve(
          __dirname,
          '../src/test/angular-core-shim.ts',
        ),
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
