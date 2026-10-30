# Component map

All classes are prefixed `lg-` so they never clash with Bootstrap, Tailwind or your own CSS. Components auto-initialize, including markup you add later. Modifier classes (`tinted`, `small`, `interactive`…) only apply together with an `lg-` base class.

## Glass material

```html
<div class="lg-glass">Regular glass</div>
<div class="lg-glass clear">Clear</div>
<div class="lg-glass thick">Thicker blur</div>
<div class="lg-glass tinted" style="--tint:var(--purple)">Tinted</div>
<div class="lg-glass interactive" data-lens>Pointer light + press physics</div>
```

Set `--r` for a component's corner radius, `--glass-blur` for blur strength, `--glass-sat` for saturation, and `--tint` for a tint color. Add `data-lens` to opt into optional Chromium SVG refraction. Enable/disable all lenses with `LG.setLens(true|false)`.

## Component classes

| Component | HTML / class | SwiftUI-inspired counterpart |
|---|---|---|
| Material | `.lg-glass`, `.clear`, `.thick`, `.tinted`, `.interactive` | `.glassEffect(...)` |
| Buttons | `.lg-btn.lg-glass`, `.lg-btn.lg-glass.tinted`, `.lg-btn.bordered`, `.lg-btn.filled`, `.lg-btn.plain` | `.buttonStyle(.glass / .glassProminent / .bordered)` |
| Toolbar capsule | `.lg-glass-group` with `.gbtn` buttons | `GlassEffectContainer` |
| Morphing control | `.lg-morph` with `.m-main` and `.m-item` buttons | `glassEffectID` / matched glass union |
| Toggle | `.lg-toggle` | `Toggle(isOn:)` |
| Slider | `.lg-slider`; modifiers `.bar`, `.vertical`; `data-min`, `data-max`, `data-step`, `data-value` | `Slider(value:in:step:)` |
| Stepper | `.lg-stepper`; `data-min`, `data-max`, `data-step`, `data-value` | `Stepper` |
| Segmented picker | `.lg-seg` containing buttons | `.pickerStyle(.segmented)` |
| Text input | `.lg-field`; `.lg-search` | `TextField`, `SecureField`, `.searchable` |
| Grouped form/list | `.lg-form`, `.lg-section`, `.lg-group`, `.lg-row` | `Form`, `List`, `.insetGrouped` |
| Swipe actions | `.lg-swipe` with `.actions` and `.lg-row` children | `.swipeActions` |
| Disclosure | `.lg-disclosure` with `.lg-row` and `.content` | `DisclosureGroup` |
| Tabs | `.lg-tabbar` containing `.tab` buttons | `TabView` |
| Page dots | `.lg-pages` with `data-count`, optional `data-index` | `PageControl` |
| Progress | `.lg-spinner`, `.lg-progress`, `.lg-gauge` | `ProgressView`, gauge styles |
| Badge | `.lg-badge` | `.badge()` |
| Notifications | `.lg-notif` | Notification / widget surface |
| System surfaces | `.lg-cc-*`, `.island`, `.status`, `.home-ind` | Control Center / Lock Screen / Dynamic Island-inspired demo |

## Interactive events and properties

- `.lg-toggle` exposes `lgSet(boolean, emit = true)`, `aria-checked`, and dispatches `change` with `event.detail` set to a boolean.
- `.lg-slider` exposes `lgSet(number, emit = true)` and `lgGet()`. It dispatches `input` while dragging and `change` when the drag ends; `event.detail` is the numeric value. Keyboard arrow keys work after focus.
- `.lg-stepper` dispatches `change` with the numeric value.
- `.lg-seg` and `.lg-tabbar` dispatch `change` with `{ index, value }`. Use `element.lgSelect(index)` on either control to select in code.
- `.lg-gauge` exposes `lgSet(0...1)`; `.lg-pages` exposes `lgSet(index)`.
- `.lg-disclosure` toggles on pointer, Enter, or Space. `.lg-swipe` rows expose `lgClose()`; `LG.removeRow(element)` animates removal.

## Overlay helpers

```js
await LG.alert({
  title: 'Saved', message: 'Your changes are ready.',
  actions: [{ label: 'OK', style: 'primary' }]
});

await LG.dialog({
  title: 'Delete item?', message: 'This cannot be undone.',
  actions: [
    { label: 'Delete', style: 'destructive', action: () => {} },
    { label: 'Cancel', style: 'cancel' }
  ]
});

const sheet = LG.sheet({ title: 'Details', content: '<p>Content</p>', detent: 'medium' });
sheet.setDetent('large');
sheet.close();

LG.menu(buttonElement, [
  { label: 'Copy', icon: 'square-stack', action: () => {} },
  '-',
  { label: 'Delete', icon: 'trash', style: 'destructive', action: () => {} }
]);

LG.toast({ text: 'Saved', iconName: 'check', tint: 'var(--green)', duration: 2200 });
```

For local overlays, add `data-overlay-host` to a positioned container and pass `origin: triggerOrChild` to the helper. Otherwise, overlays are hosted at the viewport. `LG.longPress(element, callback, delayMs)` adds a context menu / long-press affordance.

## Icons

Use `<i data-icon="heart"></i>` for a bundled, local SVG icon. The available names are exposed through `LGIcons.names`; icon rendering is handled by `LG.renderIcons(root)` and `LG.init(root)`. This icon set is an original, small SF Symbols-inspired set, not Apple's SF Symbols font.
