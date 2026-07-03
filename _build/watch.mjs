// watch.mjs — auto-stamp partials into every page whenever a partial changes.
//
// Keeps the SEO-safe inline architecture (see gen.mjs) but removes the manual
// step: edit site/partials/header.html or footer.html, save, and every page is
// re-stamped instantly. No framework, no runtime JS on the site itself.
//
// Usage:  cd site && node _build/watch.mjs      (Ctrl-C to stop)
//
// Watches the partials/ dir. On any change it re-runs the full build. A short
// debounce collapses editor "save = write twice" bursts into one build.

import { watch } from 'node:fs';
import { join } from 'node:path';
import { build, root } from './gen.mjs';

const partialsDir = join(root, 'partials');

// Build once on startup so pages are current the moment the watcher runs.
console.log('watch: initial build…');
console.log(`watch: ${build()} page(s) up to date. Watching partials/ …\n`);

let timer = null;
function rebuild(file) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const stamp = new Date().toTimeString().slice(0, 8);
    const n = build({ log: false });
    console.log(`[${stamp}] ${file ?? 'partials'} changed → re-stamped ${n} page(s).`);
  }, 80);
}

watch(partialsDir, { persistent: true }, (_event, filename) => {
  if (filename && filename.endsWith('.html')) rebuild(filename);
});

process.on('SIGINT', () => {
  console.log('\nwatch: stopped.');
  process.exit(0);
});
