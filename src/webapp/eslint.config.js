import * as path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import eslintJs from '@eslint/js'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: eslintJs.configs.recommended
})

export default tsEslint.config(
  // Глобальные исключения
  {
    ignores: ['dist', 'eslint.config.js']
  },
  // Конфигурация для tailwind.config.js
  {
    files: ['tailwind.config.js'],
    languageOptions: {
      globals: { ...globals.node }
    },
    rules: {
      'no-undef': 'error',
      'no-unreachable': 'error'
    }
  },
  // Базовые конфигурации
  eslintJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...compat.extends('plugin:import/recommended'),
  ...compat.extends('plugin:import/typescript'),
  // Конфигурация для TypeScript-файлов
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsEslint.parser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: dirname
      }
    },
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh,
      import: eslintPluginImport
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'] // Указываем парсер для TS-файлов
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.app.json', './tsconfig.node.json']
        },
        node: {
          extensions: ['.js', '.ts', '.tsx']
        }
      }
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      indent: 'off',
      'import/extensions': [
        'error',
        'never',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never'
        }
      ],
      'import/no-unresolved': 'error'
    }
  }
)
