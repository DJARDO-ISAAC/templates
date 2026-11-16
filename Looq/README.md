# Looq templates

Website templates built from screenshots. Each template folder is self-contained (see the `website-template-builder` skill for the rules). Templates can sit directly in `templates/` or inside a category folder such as `templates/single-page/`.

```
npm install
npm run new <slug>              # scaffold templates/<slug>/ from the design system
npm run new <category>/<slug>   # scaffold templates/<category>/<slug>/
npm run new <slug> --theme=kwan # start from another theme's values
npm run dev [slug ...]          # build, watch and serve dist/ on http://localhost:3000 (PORT to change)
npm run build [slug ...]        # minified build of all (or the named) templates into dist/
npm run ds                      # build only the design system into dist/design-system/
npm run check [slug ...]        # report what templates are missing from the design system (read-only)
```

A category name expands to every template inside it, so `npm run build single-page` builds all single-page templates.

Source (edit these):

```
templates/<slug>/               # or templates/<category>/<slug>/
  index.html   theme.css   main.js   meta.json   assets/images/   assets/fonts/
  about.html   contact.html   ...   # optional extra pages for multi-page sites
```

Every `*.html` file at the top of a template folder is a page. They all share the template's one `theme.css` and `main.js`.

Pages link to each other with clean URLs: `href="about"`, not `about.html`, and `href="./"` for the home page (`./#book` for a section on it). `npm run dev` serves `about.html` at `/slug/about` and redirects `/slug/about.html` there. Netlify, Vercel, Cloudflare Pages and GitHub Pages do the same automatically. On Apache or Nginx, add a rewrite such as Nginx's `try_files $uri $uri.html $uri/ =404;`.

Output (generated, git-ignored):

```
dist/index.html                    # list of all templates
dist/<slug>/*.html                 # every page
dist/<slug>/css/styles.css         # compiled from theme.css; only this template's classes
dist/<slug>/js/main.js
dist/<slug>/assets/
```

Nested templates keep their category in the output path, e.g. `dist/single-page/osei-bonsu-geomatics/`.

Tailwind v4 is installed once here at the root; templates never get their own `package.json`. Folders starting with `_` are skipped.

## Design system

`design-system/` is the Looq design system: shared token names, component classes, behaviour (`main.js`) and guides. Each template keeps the names and chooses its own values, variants and layout, so every template has its own identity. See `design-system/README.md` and the guides in `design-system/guides/`.

`npm run dev` and `npm run build` also build it. Open http://localhost:3000/design-system/ to browse it, switch themes, and download theme starters, `tokens.json`, `components.css`, `main.js` or the whole system as a zip.

Existing templates are not migrated yet; `npm run check` shows what each one is missing.
