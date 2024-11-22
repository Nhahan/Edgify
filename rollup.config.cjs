/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');
const postcss = require('rollup-plugin-postcss');
const dts = require('rollup-plugin-dts').default;
const alias = require('@rollup/plugin-alias').default;
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/cjs',
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      {
        dir: 'dist/esm',
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      }),
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      postcss({
        extract: true,
        minimize: true,
        sourceMap: true,
        plugins: [tailwindcss(), autoprefixer()],
      }),
      commonjs(),
    ],
    external,
  },
  {
    input: './dist/types/index.d.ts',
    output: {
      file: './dist/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        exclude: [/\.css$/],
      }),
    ],
    external: [/\.css$/],
  },
];
