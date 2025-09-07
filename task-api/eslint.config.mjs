// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'warn',
			'no-trailing-spaces': ['error', { skipBlankLines: true }],
			'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
			'no-multi-spaces': 'error',
			'key-spacing': 'error',
      'max-len': ['error', { code: 100, tabWidth: 2 }],
			semi: ['error', 'never'],
			quotes: ['error', 'single'],
			'comma-dangle': [
				'error',
				{
					arrays: 'never',
					objects: 'never',
					imports: 'never',
					exports: 'never',
					functions: 'never'
				}
			]
    },
  },
);