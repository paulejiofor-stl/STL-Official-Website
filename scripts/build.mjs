// Tiny static-site builder: stitches shared partials (header, footer, etc.)
// into every page in src/pages and writes clean URLs to dist/.
//   src/pages/index.html      -> dist/index.html
//   src/pages/services.html   -> dist/services/index.html
// Inside a page or partial:
//   <!-- @include header -->                    insert src/partials/header.html
//   <!-- @include head title="..." desc="..." --> pass values, used as {{title}}, {{desc}}
//   {{root}}                                     relative path back to the site root
//   {{link:services}}                            link to another page (works locally and in production)
//   {{list:who}}                                 turn a value like "a|b|c" into <li> items
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const preview = process.argv.includes('--preview');
const SRC = 'src', OUT = 'dist';
const SITE = 'https://standpointng.com';

if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });
cpSync('public', OUT, { recursive: true });
mkdirSync(join(OUT, 'assets/js'), { recursive: true });
cpSync(join(SRC, 'js'), join(OUT, 'assets/js'), { recursive: true });

const partial = (name) => readFileSync(join(SRC, 'partials', `${name}.html`), 'utf8');
const parseAttrs = (s = '') => Object.fromEntries([...s.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

function render(html, vars, depth = 0) {
  if (depth > 5) throw new Error('Include nesting too deep');
  html = html.replace(/<!--\s*@include\s+([\w-]+)([^>]*?)-->/g, (_, name, attrs) =>
    render(partial(name), { ...vars, ...parseAttrs(attrs) }, depth + 1));
  return html.replace(/\{\{(\w+)(?::([\w-]+))?\}\}/g, (m, key, arg) => {
    if (key === 'link') {
      const target = arg === 'home' ? '' : `${arg}/`;
      return vars.root + target + (preview ? 'index.html' : '');
    }
    if (key === 'list') return (vars[arg] || '').split('|').map((x) => `<li>${x.trim()}</li>`).join('');
    return key in vars ? vars[key] : m;
  });
}

for (const file of readdirSync(join(SRC, 'pages')).filter((f) => f.endsWith('.html'))) {
  const slug = file.replace('.html', '');
  const isRoot = slug === 'index' || slug === '404';
  const outFile = isRoot ? join(OUT, file) : join(OUT, slug, 'index.html');
  const vars = {
    root: isRoot ? './' : '../',
    page: slug,
    canonical: SITE + (isRoot ? (slug === 'index' ? '/' : '/404') : `/${slug}/`),
    year: String(new Date().getFullYear()),
  };
  if (slug === '404') vars.root = '/';
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, render(readFileSync(join(SRC, 'pages', file), 'utf8'), vars));
  console.log('built', outFile);
}
