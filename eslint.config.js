import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        // Node/Bun/CommonJS built-ins
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // Bun-specific globals
        Bun: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
      },
      ecmaVersion: 2022,
    },
    plugins: {
      prettier: prettierPlugin,
      '@stylistic/js': stylisticJs,
    },
    rules: {
      'prettier/prettier': 'error',
      // Optional: Good starter rules for TypeScript projects
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
