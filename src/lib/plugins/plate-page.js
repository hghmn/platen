// plate page plugin

import * as path from 'path'
// import globby from 'globby'
// import rc from 'rc'
// import vite from 'vite'


const fs = require('fs')
const util = require('util')
const marked = require('marked')
const readdirAsync = util.promisify(fs.readdir)
const readFileAsync = util.promisify(fs.readFile)

import { html as template } from '../templates/html'

export function PlatePagePluginFactory(options) {
  const {
    base = 'src',
    root,
  } = options

  const pages = new Set()

  return {
    name: 'PlatePage',

    // create index page after build finishes
    /*
    generateBundle(output, bundle) {

      const links = [...pages].map(page => `<li><a href="${page}">${page}</a></li>`)
      const source = template({
        content: `
        <h1>Index</h1>
        <ul>${links.join('\n')}</ul>
        `
      })

      const indexFile = {
        type: 'asset',
        name: 'Root Index',
        fileName: 'index.html',
        source,
      }

      this.emitFile(indexFile)
    },
    */

    resolveId(id, parent) {
      // pick up pages, and clean the url
      if (id.startsWith('$page:')) {
        const page = id === '$page:/'
          ?  'index.html'
          : id.replace('$page:/', '') + '/index.html'
        pages.add(page)
        return page;
      } else if (id.startsWith('.') && parent) {
        // console.log('resolve with parent', id, parent)

        if (pages.has(parent)) {
          const page = parent.replace('index.html', '')
          return path.resolve(root, path.join(base, page, id))
        }
      } else {
        // console.log('else', id)
      }
    },

    async load(id) {
      // const page = id.replace('$page:', '')

      if (pages.has(id)) {
        const page = id.replace(/\/?index.html$/, '')
        const pageRoot = path.resolve(root, path.join(base, page))

        // TODO: use glob
        const files = await readdirAsync(pageRoot)

        if (files.includes('index.html')) {
          return readFileAsync(path.resolve(root, path.join(base, id)), 'utf-8') // .replace('$page', ''))
        } else if (files.includes('index.md')) {
          const markdown = await readFileAsync(path.resolve(root, path.join(base, page, 'index.md')), 'utf-8')
          const html = marked(markdown)
          return template({ content: html })
        } else if (files.includes('index.js')) {
          const script = path.resolve(root, 'src/javascript/index.js')
          const source = template({ files: { js: [{ fileName: script, type: 'module' }] } }) // `<html><script src="${resolved}"></html` // fs.readFileSync(resolved, 'utf-8')
          return source;
        } else {
          throw new Error('Index file not found for page: ' + id)
        }

      }
    }
  }
}

export default PlatePagePluginFactory
