# Liquid Glass Kit

iOS 26-style **Liquid Glass** UI for any website. Glass buttons, toggles, sliders, tab bars, sheets, menus, alerts, toasts and more. Plain CSS + vanilla JS, zero dependencies, ~30 KB minified.

Works like an icon library: add two tags and every component turns on by itself.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR-GITHUB-NAME/liquid-glass-kit@1.0.0/dist/liquid-glass.min.css">
<script src="https://cdn.jsdelivr.net/gh/YOUR-GITHUB-NAME/liquid-glass-kit@1.0.0/dist/liquid-glass.min.js" defer></script>

<button class="lg-btn lg-glass interactive">Glass button</button>
```

> Independent recreation of the look and feel for learning and prototyping. Not affiliated with Apple.

---

## 1. Put it online (free, about 5 minutes)

### Option A: GitHub + jsDelivr (no npm account needed)

1. Create a **public** GitHub repo named `liquid-glass-kit`.
2. Upload everything in this folder (keep the `dist/` folder).
3. On GitHub, go to **Releases → Draft a new release**, create tag `1.0.0`, and publish.
4. Your CDN links now work. Replace `YOUR-GITHUB-NAME` with your username:

```text
https://cdn.jsdelivr.net/gh/YOUR-GITHUB-NAME/liquid-glass-kit@1.0.0/dist/liquid-glass.min.css
https://cdn.jsdelivr.net/gh/YOUR-GITHUB-NAME/liquid-glass-kit@1.0.0/dist/liquid-glass.min.js
```

Tip: `@1` instead of `@1.0.0` always serves the newest 1.x version.

### Option B: npm (then it's also on unpkg + jsDelivr)

```sh
npm login
npm publish            # if the name is taken, rename in package.json, e.g. "@your-name/liquid-glass-kit"
```

```text
https://unpkg.com/liquid-glass-kit@1/dist/liquid-glass.min.css
https://cdn.jsdelivr.net/npm/liquid-glass-kit@1/dist/liquid-glass.min.js
```

### Option C: show off the demo page

Turn on **GitHub Pages** for the repo (Settings → Pages → deploy from `main`). The showcase lives at `https://YOUR-GITHUB-NAME.github.io/liquid-glass-kit/demo/`.

---

## 2. Use it

### In plain HTML
Add the two tags above. That's it: components in the page **and added later** are auto-initialized.

### With a bundler (React, Vue, Svelte, Vite…)
```sh
npm install liquid-glass-kit
```
```js
import "liquid-glass-kit/css";
import LG from "liquid-glass-kit";   // also available as window.LG
```

### Page options (on `<html>`)

| Attribute | Effect |
|---|---|
| `data-theme="auto"` | Follow system light/dark (also `light` / `dark`) |
| `data-lg-refraction` | Turn on real edge refraction for elements with `data-lens` (Chromium) |
| `data-lg-manual` | Don't auto-init; call `LG.init()` yourself |

---

## 3. Zero-JavaScript components

```html
<!-- Alert -->
<button class="lg-btn lg-glass interactive"
  data-lg-alert data-title="Delete photo?" data-message="This can't be undone."
  data-actions="Cancel:cancel|Delete:destructive">Delete</button>

<!-- Sheet from a template (medium or large detent) -->
<button class="lg-btn lg-glass interactive" data-lg-sheet="#prefs" data-title="Settings" data-detent="medium">Settings</button>
<template id="prefs"> …any HTML… </template>

<!-- Menu -->
<button class="lg-btn icon lg-glass interactive" data-lg-menu="#more" aria-label="More"><i data-icon="ellipsis"></i></button>
<template id="more">
  <header>Options</header>
  <button value="copy" data-lg-icon="square-stack">Copy</button>
  <hr>
  <button value="delete" data-lg-icon="trash" data-role="destructive">Delete</button>
</template>

<!-- Toast -->
<button class="lg-btn lg-glass interactive" data-lg-toast="Saved!" data-toast-icon="check">Save</button>

<!-- Confirmation dialog -->
<button class="lg-btn lg-glass interactive" data-lg-dialog data-title="Sign out?" data-actions="Sign Out:destructive|Cancel:cancel">Sign out</button>
```

Events bubble from the trigger: `lg:select` (menu, `{ value, label }`), `lg:result` (alert/dialog, button label), `lg:open` / `lg:close` (sheet).

## 4. JavaScript API

```js
LG.alert({ title, message, actions: [{ label, style: 'cancel' | 'primary' | 'destructive' }] })  // → Promise<label>
LG.dialog({ title, message, actions })                                                       // → Promise<label>
LG.sheet({ title, content, detent: 'medium' | 'large' })                                     // → { el, body, close, setDetent }
LG.menu(triggerEl, [{ label, icon, style, action }, '-', { header: 'Title' }])
LG.toast({ text, iconName, tint, duration })
LG.setTheme('light' | 'dark' | 'auto');   LG.setLens(true);   LG.init(rootEl);   LG.icon('heart')
```

Full component list, classes and events: **COMPONENTS.md**.

## Folder

```text
dist/      ← what websites load (liquid-glass[.min].css / .js, .esm.js)
src/       ← editable source (css + js)
demo/      ← the full showcase site (open demo/index.html)
examples/  ← starter.html, a minimal copy-paste page
scripts/   ← build.mjs: `npm install && npm run build` rebuilds dist/ from src/
```

Browser support: current Safari, Chrome, Edge, Firefox. Refraction lens is Chromium-only and falls back to regular glass elsewhere. Respects reduced motion and reduced transparency.

MIT License.
