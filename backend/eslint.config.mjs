
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'], 
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2023,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-call': 'off',
  },
  
  ignorePatterns: ['dist', 'node_modules'],
  overrides: [
    {
      files: ['src/**/*.dto.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ],
};