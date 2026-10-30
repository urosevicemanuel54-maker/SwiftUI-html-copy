// Builds dist/ from src/. Usage: npm run build  (or: node scripts/build.mjs)
// Concatenation needs only Node. Minified files use esbuild when installed.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const read = (p) => readFileSync(join(root, p), 'utf8');
const banner = `/*! Liquid Glass Kit v${pkg.version} | MIT License | iOS 26-style Liquid Glass components for the web */\n`;
mkdirSync(join(root, 'dist'), { recursive: true });

const css = banner + ['src/css/liquid-glass.css', 'src/css/components.css'].map(read).join('\n');
const js = banner + ['src/js/icons.js', 'src/js/liquid-glass.js', 'src/js/auto.js'].map(read).join('\n');
const esm = js + '\nconst LG = window.LG;\nexport { LG };\nexport default LG;\n';
writeFileSync(join(root, 'dist/liquid-glass.css'), css);
writeFileSync(join(root, 'dist/liquid-glass.js'), js);
writeFileSync(join(root, 'dist/liquid-glass.esm.js'), esm);

try {
  const { transform } = await import('esbuild');
  const min = async (code, loader) => banner + (await transform(code, { loader, minify: true, legalComments: 'none' })).code;
  writeFileSync(join(root, 'dist/liquid-glass.min.css'), await min(css, 'css'));
  writeFileSync(join(root, 'dist/liquid-glass.min.js'), await min(js, 'js'));
  console.log('Built dist/ (full + minified)');
} catch {
  console.log('Built dist/ (full). Run `npm install` to also produce minified files.');
}
