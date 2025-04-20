import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import airbnbBase from "eslint-config-airbnb-base";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  airbnbBase, // Usa as regras do Airbnb
  {
    plugins: {
      prettier,
      import: importPlugin,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          semi: true, // Garante ponto e vírgula no final
          singleQuote: true, // Usa aspas simples por padrão
          trailingComma: "es5",
        },
      ],
      semi: ["error", "always"], // Sempre usar ponto e vírgula
      "space-before-function-paren": ["error", "always"], // Espaço antes do parêntese da função
      quotes: ["error", "single", { avoidEscape: true }], // Aspas simples por padrão
      "import/prefer-default-export": "off", // Desativa a regra que força export default

      // Regra que garante que as importações devem sempre ter extensão
      "import/extensions": [
        "error",
        "always", // Força a inclusão da extensão
        {
          js: "never", // Impede a extensão .js para arquivos JS se você não quiser
          mjs: "always", // Força a inclusão da extensão .mjs para arquivos MJS
          cjs: "always", // Força a inclusão da extensão .cjs para arquivos CJS
        },
      ],

      // Regra para resolver importações com extensões e configurações adequadas
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      },
    },
  },
];
