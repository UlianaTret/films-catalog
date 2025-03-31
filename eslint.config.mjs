import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHook from 'eslint-plugin-react-hooks';

import globals from 'globals';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
        'src/services/serv-requests.js'
    ],
  },
  js.configs.recommended,


  // React
  {
    files: ['src/components/*.jsx', "src/components/*.js", "src/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        "ecmaFeatures": { "jsx": true },
        "ecmaVersion": "latest",
        "sourceType": "module",
      },
    },
    plugins: {
      'jsx-a11y': eslintPluginJsxA11y,
      react: eslintPluginReact,
    },
    rules: {
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-ambiguous-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/autocomplete-valid': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/html-has-lang': 'warn',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/lang': 'warn',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'warn',
      'jsx-a11y/no-access-key': 'warn',
      'jsx-a11y/no-aria-hidden-on-focusable': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'warn',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/scope': 'warn',
      'jsx-a11y/tabindex-no-positive': 'warn',

      'react/button-has-type': 'warn',
      'react/jsx-closing-bracket-location': ['warn', 'tag-aligned'],
      'react/jsx-closing-tag-location': 'warn',
      'react/jsx-equals-spacing': 'warn',
      'react/jsx-fragments': 'warn',
      'react/jsx-key': 'warn',
      'react/jsx-no-duplicate-props': 'warn',
      'react/jsx-no-undef': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-pascal-case': 'warn',
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",

      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'warn',
      'react/no-find-dom-node': 'warn',
      'react/no-invalid-html-attribute': 'warn',
      'react/no-multi-comp': ['warn', {ignoreStateless: true}],
      'react/no-namespace': 'warn',
      'react/no-object-type-as-default-prop': 'warn',
      'react/no-render-return-value': 'warn',
      'react/no-string-refs': 'warn',
      'react/no-this-in-sfc': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'warn',
      'react/no-unstable-nested-components': 'warn',
      'react/prefer-stateless-function': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'warn',
      'react/style-prop-object': 'warn',
      'react/void-dom-elements-no-children': 'warn',
    },


    settings: {
      "react": {
        "version": "detect"
      }
    },
  },

  // All JS/TS
  {
    files: ['src/components/*.jsx', "src/components/*.js", "src/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'import/no-extraneous-dependencies': 'warn',
      'import/no-self-import': 'warn',
      'import/no-unused-modules': 'warn',
      'no-console': 'warn',
    },
    settings: {
      'import/parsers': {
        espree: ['.js', '.cjs', '.jsx'],
      },
    },
  },

  // JS/MJS in root
  {
    files: ['*.js', '*.mjs'],
    ignores: ['src', 'electron'],
    rules: {
      'no-console': 'off',
    },
  },

  // Hooks
  {
    files: ['**/use*.*'],
    plugins: {
      'react-hooks': eslintPluginReactHook,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'unicorn/consistent-function-scoping': 'off',
    },
  },

  // Config files
  {
    files: ['**/*.config.*'],
    ignores: [
      "out/",
      "dist/",
      "**/*.d.ts",
      "web/**/*.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
  eslintConfigPrettier,
];