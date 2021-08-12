// Build script for platen library
const globby = require('globby')
const esbuild = require('esbuild')

async function build() {
  const libFiles = await globby([
    'src/lib/**/*.js'
  ])

  await esbuild.build({
    entryPoints: libFiles,
    outdir: 'dist/lib',
    sourcemap: false,
    format: 'cjs',
    target: ['esnext'],
    platform: 'node',
  })  
}

build()
