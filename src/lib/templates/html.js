export function html(options) {
  const {
    title = 'Index',
    files = {},
    content = '<div id="app"></div>',
  } = options;

  const scripts = (files.js || [])
    .map(({ fileName, type = 'module' }) => {
      // const attrs = makeHtmlAttributes(attributes.script);
      return `<script src="${fileName}" type="${type}"></script>`;
    })
    .join('\n');

  return `<!doctype html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    ${content}
    ${scripts}
  </body>
</html>
`;
}