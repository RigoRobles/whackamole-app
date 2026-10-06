import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, 'dist');
const gasDir = join(root, 'gas');
const distHtml = readFileSync(join(distDir, 'index.html'), 'utf8');

const cssMatches = [...distHtml.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)];
const scriptMatches = [...distHtml.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"[^>]*><\/script>/g)];

let html = distHtml;

for (const match of cssMatches) {
  const href = match[1].replace(/^\.\//, '');
  const css = readFileSync(join(distDir, href), 'utf8');
  html = html.replace(match[0], () => `<style>\n${css}\n</style>`);
}

for (const match of scriptMatches) {
  const src = match[1].replace(/^\.\//, '');
  const js = readFileSync(join(distDir, src), 'utf8')
    .replace(/<\/script/gi, '<\\/script');
  html = html.replace(match[0], () => `<script type="module">\n${js}\n</script>`);
}

html = html.replace(
  '</head>',
  [
    '    <base target="_top" />',
    '    <script>',
    "      window.TEACHER_RIGO_APPS_SCRIPT = true;",
    '    </script>',
    '  </head>',
  ].join('\n'),
);

mkdirSync(gasDir, { recursive: true });
writeFileSync(join(gasDir, 'Index.html'), html, 'utf8');
