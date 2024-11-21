const path = require('path');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');
const dts = require('rollup-plugin-dts').default;
const alias = require('@rollup/plugin-alias').default;

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
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
    ],
    external,
  },
  {
    input: './dist/types/index.d.ts',
    output: {
      file: './dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
