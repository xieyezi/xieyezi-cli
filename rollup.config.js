//rollup.config.js
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
const nodeResolve = require('rollup-plugin-node-resolve')
export default {
  //入口文件
  input: 'src/index.js',
  output: [
    {
      banner: '#!/usr/bin/env node',
      name: 'xieyezi-cli',
      file: 'bin/xieyezi-cli.js',
      //打包成umd模块规范
      format: 'umd'
    }
  ],
  external: [
    'chalk',
    'commander',
    'didyoumean',
    'download-git-repo',
    'figlet',
    'fs-extra',
    'inquirer',
    'ora',
    'semver'
  ],
  plugins: [
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js']
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    terser()
  ]
}
