import * as path from 'path'
import globby from 'globby'
// import rc from 'rc'
import vite from 'vite'

const fs = require('fs')
const util = require('util')
const readdirAsync = util.promisify(fs.readdir)
const marked = require('marked')

import { resolveConfig } from './config'
import { html as template } from './templates/html'
import platePagePlugin from './plugins/plate-page'

export async function build({ root }) {
  const config = resolveConfig()
	// const conf = rc('plate', {
	// 	baseDir: 'src',
 //    outDir: 'dist',
	// 	include: ['src'],
	// 	exclude: [],
	// });

	// console.log('.platerc', conf)

	const includePatterns = config.include;
	const excludePatterns = config.exclude.map(p => `!${p}`)

	const files = await globby(includePatterns.concat(excludePatterns))
	const indexRe = /\/index\.(html|js|md)$/

	const indexFiles = files.filter(f => indexRe.test(f))

  // get the entry points
  const entryPoints = indexFiles.reduce((acc, filename) => {
    let page = filename.replace(indexRe, '')
    if (page.startsWith(config.baseDir)) {
      page = page.substr(config.baseDir.length)
    }

    let pageKey = page.replace(/^\//, '')
    if (page === '') {
      page = '/'
      pageKey = 'index'
    }

    acc[pageKey] = '$page:' + page;

    return acc;
  }, {})

	// console.log('entryPoints', entryPoints)

	const outDir = path.resolve(root, config.outDir)

	await vite.build({
	    emptyOutDir: true,
	    root, // path.resolve(__dirname, '.'),
	    plugins: [
	      platePagePlugin({
	        root,
	        base: config.baseDir,
	      }),
	    ],
      resolve: {
        alias: {
          '@plate': path.resolve(__dirname, '../../src/modules'),
        }
      },
	    build: {
	      outDir,
	      rollupOptions: {
	        input: entryPoints,
          // {
	          // main: path.resolve(__dirname, 'src/index.html'),
	          // basic: '$page:basic',
	          // javascript: '$page:javascript',
	          // // javascript: path.resolve(__dirname, './src/javascript/index.js'),
	          // ignored: path.resolve(__dirname, './src/ignored/index.html'),
	        // },
	        // output: {
	        //   plugins: [outputPlugin()],
	        // },
	      }
	    }
	  })
}

// function myPlugin2(options) {
//   const {
//     base = 'src',
//     root,
//   } = options;

//   const pages = new Set()

//   return {
//     name: 'myPlugin2',

//     // create index page after build finishes
//     /*
//     generateBundle(output, bundle) {

//       const links = [...pages].map(page => `<li><a href="${page}">${page}</a></li>`)
//       const source = template({
//         content: `
//         <h1>Index</h1>
//         <ul>${links.join('\n')}</ul>
//         `
//       })

//       const indexFile = {
//         type: 'asset',
//         name: 'Root Index',
//         fileName: 'index.html',
//         source,
//       }

//       this.emitFile(indexFile)
//     },
//     */

//     resolveId(id, parent) {
//       // pick up pages, and clean the url
//       if (id.startsWith('$page:')) {
//         const page = id === '$page:/'
//           ?  'index.html'
//           : id.replace('$page:/', '') + '/index.html'
//         pages.add(page)
//         return page;
//       } else if (id.startsWith('.') && parent) {
//         console.log('resolve with parent', id, parent)
//         if (pages.has(parent)) {
//           const page = parent.replace('index.html', '')
//           return path.resolve(root, path.join(base, page, id))
//         }
//       } else {
//         // console.log('else', id)
//       }
//     },

//     async load(id) {
//       // const page = id.replace('$page:', '')

//       if (pages.has(id)) {
//         const page = id.replace(/\/?index.html$/, '')
//         const pageRoot = path.resolve(root, path.join(base, page))

//         const files = await readdirAsync(pageRoot)

//         if (files.includes('index.html')) {
//           return fs.readFileSync(path.resolve(root, path.join(base, id)), 'utf-8') // .replace('$page', ''))
//         } else if (files.includes('index.md')) {
//           const markdown = fs.readFileSync(path.resolve(root, path.join(base, page, 'index.md')), 'utf-8')
//           const html = marked(markdown)
//           return template({ content: html })
//         } else if (files.includes('index.js')) {
//           const script = path.resolve(root, 'src/javascript/index.js')
//           const source = template({ files: { js: [{ fileName: script, type: 'module' }] } }) // `<html><script src="${resolved}"></html` // fs.readFileSync(resolved, 'utf-8')
//           return source;
//         } else {
//           throw new Error('Index file not found for page: ' + id)
//         }

//       }
//     }
//   }
// }

// function template(options) {
//   const {
//     title = 'Index',
//     files = {},
//     content = '<div id="app"></div>',
//   } = options;

//   const scripts = (files.js || [])
//     .map(({ fileName, type = 'module' }) => {
//       // const attrs = makeHtmlAttributes(attributes.script);
//       return `<script src="${fileName}" type="${type}"></script>`;
//     })
//     .join('\n');

//   return `<!doctype html>
// <html>
//   <head>
//     <title>${title}</title>
//   </head>
//   <body>
//     ${content}
//     ${scripts}
//   </body>
// </html>
// `;
// }