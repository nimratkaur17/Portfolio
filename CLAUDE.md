# Portfolio — project context

Personal portfolio for Nimrat Kaur, a product designer who also builds. The site itself is a work sample: it is applied to hybrid design-engineer roles, so code quality and interaction craft are part of the deliverable, not just the visuals.

## Stack

- React + Vite + TypeScript
- Plain CSS with custom properties (no Tailwind unless we decide otherwise later)
- Deployed on Vercel from GitHub; custom domain DNS points there from Wix

## Colour

Use these as CSS custom properties. Never hardcode hex values in components. Never use black for text; the darkest text colour is espresso (`--color-text`, #30150E).

```css
:root {
  --color-bg:        #FAF6EE;  /* ivory — page background */
  --color-surface:   #DBC4A5;  /* sand — cards, alternate sections */
  --color-text:      #30150E;  /* espresso — primary text */
  --color-primary:   #4A1625;  /* merlot — brand, CTAs, links */
  --color-primary-h: #662C3C;  /* mauve — hover/active on merlot */
  --color-accent:    #5B5A3A;  /* olive — tags, category labels */
  --color-contrast:  #1B2A3D;  /* navy — one distinct section or case study */
  --color-muted:     #6B7884;  /* slate — borders, captions, disabled */
}
```

Rough usage ratio: 60% ivory and espresso, 25% merlot, 10% olive and navy, 5% sand. Merlot is the signature colour — concentrated, not spread thin.

Tint and shade ramps are not defined yet. If a component needs a lighter or darker step, propose specific values rather than inventing them silently.

## Type

- Figtree throughout (headings, body, labels), via `--font-body`. The one exception is the hero name, set in Freeman via `--font-name` (single weight, so `font-weight: 400`). Never use a raw family name.
- Two weights only: 400 regular, 500 medium. 800 for the how-I-think pills.
- Body and headings are sentence case. Small labels (kickers, rail labels, stat captions, fact labels, tags) are uppercase and letterspaced, still in Figtree 500.

## Motion conventions

- **Never animate on a raw scroll event listener.** Use `animation-timeline: view()` where supported, with an `IntersectionObserver` plus `requestAnimationFrame` fallback.
- **Throttle `mousemove` to `requestAnimationFrame`.** One listener per group, never one per element.
- **Proximity and hover effects write `transform` only** — never layout properties.
- **Any hover transform on a rotated element must re-declare its rotation**, or the element snaps flat. Store per-element tilt as `--rot` and reuse it in every transform.
- **Entrance animations play once.** Scroll-linked depth effects track scroll continuously in both directions. This mix is deliberate.
- **`prefers-reduced-motion` is the accessible default, not a downgrade.** Drop flight, proximity, scale and stagger. Everything renders in place at final state. Static tilts stay — they are styling, not motion.
- Shadows: crossfade two stacked pseudo-elements via `opacity` rather than transitioning `box-shadow`, which repaints every frame.

## Accessibility baseline

- Every page readable and interactive at frame 0 if scripting fails
- Per-letter text splits need `aria-label` on the parent and `aria-hidden` on each span
- Interactive nodes are real `<button>` or `<a>` elements, never clickable divs
- Visible focus rings everywhere; Escape dismisses any open card or popover
- Never use `title` attributes for tooltips

## Layout constants

- Sticky header height: 88px
- `scroll-margin-top: 88px` on every anchor target
- Use `100dvh`, not `100vh`
- Breakpoint at 760px: below it, complex layouts (sticky card stack, pill rows) simplify

## Working style

Build one component at a time and stop for review before moving on. Prefer asking a question over guessing when a spec is ambiguous.
