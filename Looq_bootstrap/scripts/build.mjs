// Builds templates/<slug>/ into dist/<slug>/:
//   theme.scss -> css/styles.css   (Dart Sass, Bootstrap resolved from node_modules)
//   main.js    -> js/main.js       (esbuild bundle, IIFE)
//   *.html         -> pages, with partials/ included and site.json values filled in
//   meta.json, assets/ -> copied as-is
//
// Usage:
//   npm run build                    build every template
//   npm run build -- <slug> [<slug>] build only these templates
//   npm run dev -- <slug>            build, watch for changes, serve dist/ on http://localhost:8000
//   npm run clean                    delete dist/

import { readdir, rm, mkdir, cp, writeFile, readFile, stat } from "node:fs/promises";
import { watch, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import * as sass from "sass";
import * as esbuild from "esbuild";

const ROOT = resolve(import.meta.dirname, "..");
const TEMPLATES = join(ROOT, "templates");
const DIST = join(ROOT, "dist");
const PORT = Number(process.env.PORT) || 8000;

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const requested = args.filter((a) => !a.startsWith("--"));

async function listSlugs() {
  if (!existsSync(TEMPLATES)) return [];
  const entries = await readdir(TEMPLATES, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !e.name.startsWith("_"))
    .map((e) => e.name)
    .sort();
}

async function buildCss(src, out) {
  const file = join(src, "theme.scss");
  if (!existsSync(file)) return;
  const result = sass.compile(file, {
    loadPaths: [join(ROOT, "node_modules")],
    style: "compressed",
    sourceMap: false,
    // Bootstrap 5.3 still uses @import and legacy Sass functions; hide its warnings.
    quietDeps: true,
    silenceDeprecations: ["import", "global-builtin", "color-functions"],
  });
  await mkdir(join(out, "css"), { recursive: true });
  await writeFile(join(out, "css", "styles.css"), result.css);
}

async function buildJs(src, out) {
  const file = join(src, "main.js");
  if (!existsSync(file)) return;
  await esbuild.build({
    entryPoints: [file],
    outfile: join(out, "js", "main.js"),
    bundle: true,
    format: "iife",
    target: "es2018",
    minify: true,
    logLevel: "silent",
    nodePaths: [join(ROOT, "node_modules")],
  });
}

// ---------------------------------------------------------------
// HTML pages
//   Every *.html file in the template root becomes a page.
//   <!-- include:header.html active="about" -->  inserts partials/header.html;
//     attributes become {{ active }} inside that partial.
//   {{ site.phone }}  is replaced from site.json (nested keys use dots).
//   {{ build.year }}  is the current year.
//   Unknown placeholders fail the build so typos never ship.
// ---------------------------------------------------------------
const INCLUDE_RE = /<!--\s*include:([\w./-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->/g;
const ATTR_RE = /([\w-]+)="([^"]*)"/g;
const VAR_RE = /\{\{\s*([\w.-]+)\s*\}\}/g;

function lookup(obj, path) {
  return path.split(".").reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), obj);
}

async function renderHtml(text, ctx, file, depth = 0) {
  if (depth > 10) throw new Error(`${file}: includes nested too deeply`);
  let html = text;
  // Resolve includes (each partial sees its own attributes as params)
  const parts = [];
  let last = 0;
  for (const m of html.matchAll(INCLUDE_RE)) {
    parts.push(html.slice(last, m.index));
    const partialPath = join(ctx.src, "partials", m[1]);
    if (!existsSync(partialPath)) throw new Error(`${file}: missing partial partials/${m[1]}`);
    const params = Object.fromEntries([...m[2].matchAll(ATTR_RE)].map((a) => [a[1], a[2]]));
    const body = await readFile(partialPath, "utf8");
    parts.push(await renderHtml(body, { ...ctx, params }, `partials/${m[1]}`, depth + 1));
    last = m.index + m[0].length;
  }
  parts.push(html.slice(last));
  html = parts.join("");
  // Resolve variables
  return html.replace(VAR_RE, (whole, key) => {
    let value;
    if (key.startsWith("site.")) value = lookup(ctx.site, key.slice(5));
    else if (key.startsWith("build.")) value = lookup(ctx.build, key.slice(6));
    else value = ctx.params?.[key];
    if (value === undefined || typeof value === "object") throw new Error(`${file}: unknown placeholder ${whole}`);
    return String(value);
  });
}

async function buildPages(src, out) {
  const siteFile = join(src, "site.json");
  const site = existsSync(siteFile) ? JSON.parse(await readFile(siteFile, "utf8")) : {};
  const build = { year: new Date().getFullYear() };
  const pages = (await readdir(src)).filter((f) => f.endsWith(".html"));
  await Promise.all(
    pages.map(async (page) => {
      const text = await readFile(join(src, page), "utf8");
      const html = await renderHtml(text, { src, site, build, params: {} }, page);
      await writeFile(join(out, page), html);
    })
  );
  return pages.length;
}

async function copyStatic(src, out) {
  for (const name of ["meta.json", "assets"]) {
    const from = join(src, name);
    if (existsSync(from)) await cp(from, join(out, name), { recursive: true });
  }
}

async function buildTemplate(slug) {
  const src = join(TEMPLATES, slug);
  const out = join(DIST, slug);
  if (!existsSync(src) || !(await stat(src)).isDirectory()) {
    throw new Error(`No template folder: templates/${slug}`);
  }
  const started = Date.now();
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  const [, , pages] = await Promise.all([buildCss(src, out), buildJs(src, out), buildPages(src, out), copyStatic(src, out)]);
  console.log(`✓ ${slug}  ${pages} page${pages === 1 ? "" : "s"}  (${Date.now() - started} ms)  -> dist/${slug}/`);
}

async function buildAll(slugs) {
  let failed = 0;
  for (const slug of slugs) {
    try {
      await buildTemplate(slug);
    } catch (err) {
      failed++;
      console.error(`✗ ${slug}\n${err.message ?? err}`);
    }
  }
  return failed;
}

async function main() {
  if (flags.has("--clean")) {
    await rm(DIST, { recursive: true, force: true });
    console.log("Removed dist/");
    return;
  }

  const slugs = requested.length ? requested : await listSlugs();
  if (!slugs.length) {
    console.log("No templates found in templates/. Add templates/<slug>/ first.");
    return;
  }

  const failed = await buildAll(slugs);

  if (flags.has("--watch")) {
    for (const slug of slugs) {
      let timer;
      watch(join(TEMPLATES, slug), { recursive: true }, () => {
        clearTimeout(timer);
        timer = setTimeout(() => buildAll([slug]), 100);
      });
    }
    console.log(`Watching: ${slugs.join(", ")}`);
  }

  if (flags.has("--serve")) {
    await mkdir(DIST, { recursive: true });
    const ctx = await esbuild.context({});
    await ctx.serve({ servedir: DIST, port: PORT });
    for (const slug of slugs) console.log(`→ http://localhost:${PORT}/${slug}/`);
  }

  if (!flags.has("--watch") && !flags.has("--serve") && failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
