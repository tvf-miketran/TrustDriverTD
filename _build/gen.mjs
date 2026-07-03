// gen.mjs — stamp shared partials (header/footer) into every page.
//
// Source of truth: site/partials/header.html and site/partials/footer.html.
// Each page marks where a partial goes with a pair of HTML comments:
//
//     <!-- @include:header --> ... <!-- @endinclude:header -->
//     <!-- @include:footer --> ... <!-- @endinclude:footer -->
//
// Running `node _build/gen.mjs` replaces whatever is between each marker pair
// with the current partial. The partial ends up INLINE in the committed HTML,
// so the nav + footer links stay in the crawled markup (SEO-safe) — no runtime
// fetch/JS. Edit the partial, re-run, done.
//
// Usage:  cd site && node _build/gen.mjs          (one-off build)
//         cd site && node _build/watch.mjs        (auto-build on save)
//
// NOTE: partials use root-relative asset paths (images/..., css/...), which are
// correct for pages at the site root. When pages/ subpages are added, extend
// this script to rewrite `href="images/` -> `href="../images/` for that folder.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..'); // site/

function loadPartials() {
  return {
    header: readFileSync(join(root, 'partials', 'header.html'), 'utf8').trim(),
    footer: readFileSync(join(root, 'partials', 'footer.html'), 'utf8').trim(),
  };
}

function listPages() {
  // Pages: every *.html at the site root, plus pages/ when it exists.
  const pages = readdirSync(root)
    .filter((f) => f.endsWith('.html'))
    .map((f) => join(root, f));

  const pagesDir = join(root, 'pages');
  if (existsSync(pagesDir)) {
    for (const f of readdirSync(pagesDir)) {
      if (f.endsWith('.html')) pages.push(join(pagesDir, f));
    }
  }
  return pages;
}

function stamp(html, name, content) {
  const re = new RegExp(
    `(<!-- @include:${name} -->)[\\s\\S]*?(<!-- @endinclude:${name} -->)`
  );
  if (!re.test(html)) return { html, changed: false };
  return { html: html.replace(re, `$1\n${content}\n$2`), changed: true };
}

// Stamp all partials into all pages. Returns the number of pages written.
// { log } controls whether per-page lines are printed.
export function build({ log = true } = {}) {
  const partials = loadPartials();
  let total = 0;
  for (const page of listPages()) {
    let html = readFileSync(page, 'utf8');
    const before = html;
    for (const [name, content] of Object.entries(partials)) {
      html = stamp(html, name, content).html;
    }
    if (html !== before) {
      writeFileSync(page, html);
      total++;
      if (log) console.log('stamped', page.replace(root, '.'));
    }
  }
  return total;
}

// Run the build when invoked directly (`node _build/gen.mjs`).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const total = build();
  console.log(`\nDone — ${total} page(s) updated from partials/.`);
}
