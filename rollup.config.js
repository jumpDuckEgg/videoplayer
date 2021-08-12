import vuePlugin from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";

export default {
  input: './src/index.js',
  output: {
    file: 'dist/bundle.js'
  },
  plugins: [
    terser(),
    resolve({ extensions: ['.vue'], preferBuiltins: true }),
    scss({
      processor: () => postcss([autoprefixer()]),
      outputStyle: 'compressed'
    }),
    vuePlugin({css: false}),
    commonjs(),
  ],
}