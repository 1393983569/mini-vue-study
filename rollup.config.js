import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: 'json' };
export default {
  input: "./src/index.ts",
  output: [
    // 1. cjs -> commonjs
    // 2. esm
    {
      format: "cjs",
      file: pkg.main,
      // file: 'lib/guide-mini-vue.cjs.js',
    },
    {
      format: "es",
      // file: pkg.module,
      file: 'lib/guide-mini-vue.esm.js',
    },
  ],
  plugins: [typescript()],
}; 