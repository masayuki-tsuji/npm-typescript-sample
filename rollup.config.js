import * as path from 'path'
import { readFileSync } from "fs";
import camelCase from 'lodash.camelcase'
import upperFirst from 'lodash.upperfirst'
import pluginBuble from '@rollup/plugin-buble'
import pluginTypescript from '@rollup/plugin-typescript'
import { terser as pluginTerser } from 'rollup-plugin-terser'
import pkg from './package.json'

const moduleName = upperFirst(camelCase(pkg.name.replace(/^\@.*\//, '')))
const copyright = readFileSync("./LICENSE", "utf-8").split(/\n/g).filter(line => /^Copyright\s+/.test(line))
const banner = [
  '/*!',
  ` * ${pkg.name} v${pkg.version}`,
  ` * ${copyright}`,
  ' */',
].join('\n')

const config = {
  input: path.resolve('src/index.ts'),
  output: {
    name: moduleName,
    banner,
  },
  external: pkg.devDependencies || [],
}

export default [
  {
    ...config,
    output: {
      ...config.output,
      file: path.resolve(pkg.main),
      format: 'cjs',
    },
    plugins: [
      pluginTypescript({ sourceMap: false }),
      pluginBuble(),
      pluginTerser(),
    ],
  },
  {
    ...config,
    output: {
      ...config.output,
      file: path.resolve(pkg.module),
      format: 'es',
    },
    plugins: [
      pluginTypescript({
        sourceMap: false,
        outDir: path.dirname(pkg.module),
        declarationDir: path.dirname(pkg.module),
      }),
      pluginBuble(),
      pluginTerser(),
    ],
  }
]