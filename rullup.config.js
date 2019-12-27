//rollup.config.js
import typescript from "rollup-plugin-typescript2";
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
export default {
    //入口文件
  input: "src/main.ts",
  output: [
    {
      banner: "#!/usr/bin/env node",
      /**
       * 头部插入这段代码
       * */
      name: "xieyezi-cli",
      file: "bin/index.js",
      //打包成umd模块规范
      format: "umd"
    }
  ],
  plugins: [
    typescript(),
    commonjs({
      include: "node_modules/**",
      extensions: ['.js', '.ts']
    }),
    uglify()
  ],
};