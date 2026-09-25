# Portfolio site — product requirements

**Owner:** Nimrat Kaur
**Status:** Specification complete, build not started
**Last updated:** 14 September 2026

---

## 1. Purpose

A personal portfolio site for a product designer applying to hybrid design-engineer roles — companies like idler and Rebolt, agencies like Work & Co, and in-house teams that explicitly value designers who ship code.

The site has two jobs, and the second one is unusual:

1. **Present the work.** Case studies that demonstrate judgment, not process compliance.
2. **Be the work.** The site is hand-built in React rather than assembled in Wix or Framer, because a self-built portfolio is direct evidence of the exact skill being hired for. A recruiter who inspects the repo or the DOM should find craft there too.

This second job drives most of the technical decisions in this document. Code quality, motion discipline, and accessibility are not hygiene here — they are part of the portfolio.

### Non-goals

- A CMS or admin interface. Content is edited in code.
- A blog.
- Support for browsers older than the current two major versions.
- Dark mode (deliberately out of scope; the palette is built for a warm light surface).

---

## 2. Audience

| Visitor | What they need | How long they stay |
|---|---|---|
| Recruiter, first pass | Who she is, what she does, resume | Under 60 seconds |
| Hiring manager, design | One case study read properly, evidence of judgment | 5–10 minutes |
| Hiring manager, engineering | Proof the code claim is real — repo, DOM, interaction quality | Varies, often inspects |
| Peer designer | Aesthetic, craft, personality | Browses |

The first row is the constraint that matters most: **the site must be scannable in under a minute for someone who will not read carefully.** Every animation decision is subordinate to this. Nothing may delay or obscure the name, the role, or the path to the work.

---

## 3. Information architecture

```
/                 Landing — hero, then projects (sticky card stack)
/about            About — thesis, process, personality, contact
/case/[slug]      Case study template
/resume.pdf       Static asset, opens in new tab
```

Four routes total. No nested navigation, no submenus.

---

## 4. Design system

### 4.1 Colour

Eight values. Defined once as CSS custom properties; never hardcoded in components.

| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#FAF6EE` | Ivory. Page background. |
| `--color-surface` | `#DBC4A5` | Sand. Cards, alternate sections. |
| `--color-text` | `#241A16` | Espresso. Primary text. Used instead of black. |
| `--color-primary` | `#4A1625` | Merlot. Brand colour, CTAs, links. |
| `--color-primary-h` | `#662C3C` | Mauve. Hover and active states on merlot elements. |
| `--color-accent` | `#5B5A3A` | Olive. Tags, category labels. |
| `--color-contrast` | `#1B2A3D` | Navy. One distinct section or case study. |
| `--color-muted` | `#6B7884` | Slate. Borders, captions, disabled states. |

Target distribution: roughly 60% ivory and espresso, 25% merlot, 10% olive and navy, 5% sand. Merlot is the signature — concentrated, never spread thin.

The palette is deliberately muted throughout. There is no bright "pop" colour; hierarchy is carried by typography, spacing and the merlot/mauve pair rather than by colour contrast. This is a design choice, not an oversight.

Tint and shade ramps are not yet defined. Any component needing an intermediate step must propose specific values rather than inventing them.

### 4.2 Type

- **Figtree** throughout.
- Two weights in general use: 400 regular, 500 medium. Weight 800 is reserved for the hero skill pills.
- Sentence case everywhere. No ALL CAPS, no Title Case except proper nouns.

### 4.3 Layout constants

- Sticky header: 88px tall
- `scroll-margin-top: 88px` on every anchor target
- `100dvh`, never `100vh`
- Primary breakpoint: 760px. Below it, complex layouts simplify rather than shrink.
- Secondary breakpoint: 1100px, for the case study index rail only.

### 4.4 Motion principles

These govern every animation in the document and should be treated as rules, not preferences.

**Position is the clock, or time is — never both.** Scroll-linked effects use `animation-timeline: view()` with an `IntersectionObserver` + `requestAnimationFrame` fallback. Time-based effects use CSS transitions or keyframes. Nothing animates on a raw scroll event listener.

**Entrance animations play once. Depth and position effects track scroll continuously in both directions.** This mix is deliberate and appears in both the hero and the project stack. Content re-fading on every scroll-past is distracting; spatial effects that don't reverse feel broken.

**Write `transform` and `opacity` only.** Never animate layout properties. Never transition `box-shadow` — crossfade two stacked pseudo-elements via opacity instead.

**Any hover transform on a rotated element must re-declare its rotation.** Per-element tilt is stored as `--rot` and reused in every subsequent transform. Omitting it makes the element snap flat on hover. This affects the hero pills and the Beyond Design grid.

**`mousemove` is throttled to `requestAnimationFrame`**, with one listener per group — never one per element.

**`prefers-reduced-motion` is the accessible default, not a degraded fallback.** Flight, proximity, scale and stagger are dropped; everything renders in final state. Static tilts remain, since they are styling rather than motion.

### 4.5 Accessibility baseline

- Every page readable and interactive at frame 0 if scripting fails.
- Per-letter text splits carry `aria-label` on the parent and `aria-hidden` on each span.
- Interactive elements are real `<button>` or `<a>` — never clickable divs.
- Visible focus rings throughout. Escape dismisses any open card or popover.
- No `title` attributes for tooltips.

---

## 5. Global navigation

**Layout:** logo at far left; Projects, About Me, Resume at far right in that horizontal order.

**Behaviour**

| Element | Action |
|---|---|
| Logo | Navigates to `/`. Design TBD; text placeholder for now. |
| Projects | Scrolls to the projects section on `/`. From another route, navigates to `/` first, then scrolls. These are two distinct code paths. |
| About Me | Navigates to `/about`. |
| Resume | Opens `/resume.pdf` in a new tab (`target="_blank"`, `rel="noopener noreferrer"`). |

**Persistence:** sticky and visible across the entire site, at all scroll positions. An earlier hide-on-scroll-down design was rejected because it conflicts with the project stack's fixed 88px rest offset.

**Background transition:** transparent over the hero; after roughly 50px of scroll, fades in an ivory background with a subtle slate bottom border. Without this, project cards sliding underneath produce text over text.

---

## 6. Landing page

### 6.1 Hero

**Content:** the name "Nimrat Kaur" set large and bold, a short tagline, and ten skill pills.

**Constraint:** this section is what the 60-second visitor sees. The entry animation must never be the reason someone fails to learn who she is.

#### Entry timeline

Plays once per page load. Replays on every refresh — no `sessionStorage` suppression. Total runtime 2.6 seconds.

| Time | Event |
|---|---|
| 0.10s | Name rises and fades in over 800ms |
| 0.35s | Tagline, same rise |
| 0.45s | Pills begin entering, one every 135ms, 950ms flight each |
| 2.60s | Final pill lands; hero fully interactive |

The 135ms stagger is derived, not arbitrary: ten pills at 170ms overruns to 2.93s and misses the 2.6s target.

#### Pill flight

Four entry vectors, cycled so no two neighbours share a direction:

| Vector | Offset |
|---|---|
| Left | `(-620px, -150px)` |
| Top | `(+40px, -460px)` |
| Right | `(+620px, -140px)` |
| Bottom | `(-30px, +300px)` |

Each pill starts at `scale(.85)`, `opacity: 0`, and a counter-rotation of 16–24° opposite its settled tilt. Easing `cubic-bezier(.25,.85,.3,1)` — fast out of the edge, long settle, no bounce. Opacity reaches 1 at 60% of flight so nothing pops in at the finish line.

Resting angle is per-pill, stored as `--rot` and reused by every later transform so a pill never loses its tilt.

#### Resting layout

Two centred rows of five. 3px between pills, 2px between rows — packed, not spaced. 17px Figtree at weight 800, 13px vertical / 26px horizontal padding, full pill radius. Rows sit 15px off the bottom edge; the group reserves 26px of headroom above for hover lift.

**The leaning pill.** The leftmost pill in the top row is a deliberate exception: `--rot: -34deg`, well outside the ±6° range, so it leans onto the leftmost pill of the bottom row.

- Positioned absolutely, outside the row flow, so the 3px packing holds for the other nine.
- The bottom-row pill it rests on takes a higher `z-index`, so the leaning pill reads as resting *on* it.
- Its proximity response preserves the −34° like any other pill.
- It extends past the left edge of the group; the hero container needs enough horizontal padding to prevent clipping at narrower desktop widths.

#### Cursor proximity

One `mousemove` listener per group, throttled to `requestAnimationFrame`. For each item: `k = max(0, 1 − distance / radius)`, then transform by `k`.

**Name** — radius 190px, horizontal distance only. Letters rise `−20px × k`, scale to `1 + .16k`, tint toward the hover colour past `k > 0.5`. 400ms transition, so the wave trails the pointer slightly rather than tracking it exactly. Requires per-letter spans with `aria-label` on the parent and `aria-hidden` on each span.

**Pills** — radius 200px, true 2D distance. Lift `−14px × k`, scale `1 + .09k`, retain `rotate(var(--rot))`, step up one shadow level past `k > 0.45`. 450ms transition. Neighbours move too, less — the row should behave like a single soft surface rather than a set of independent buttons.

On `mouseleave`, both groups return to rest over the same transition. Entry animations are cleared to inline transforms on first hover so the two systems never fight for the same property.

#### Edge cases

| Condition | Behaviour |
|---|---|
| `prefers-reduced-motion` | No flight, no proximity. Name, tagline and settled pills render in place. Tilts retained. |
| Coarse pointer | No proximity. Pills get a plain `:active` press state. |
| Below 760px | Pills wrap to three rows, 15px type, entry vectors shorten to ±260px so nothing flies in from far off-screen. |
| No JavaScript | Hero fully readable and clickable at frame 0. |

### 6.2 Projects — sticky card stack

Each case study preview is a card inside its own `min-height: 100dvh` section. The card is `position: sticky; top: 88px`. All cards share the same offset, so card 2 comes to rest exactly over card 1 — **a pile, not a staircase.**

**Incoming card:** travels up with normal scroll. No transform, nothing scripted.

**Card being covered:** as the next card's top edge crosses it, it recedes — `scale 1 → 0.94`, `translateY 0 → −18px`, and a subtle darkening. Scroll-linked, so it tracks the finger in both directions and **fully reverses on scroll up**; cards uncollapse back into a normal sequence.

For the darkening, use an espresso overlay fading `0 → 0.07` rather than `filter: brightness()`. On warm off-white cards, reducing brightness reads as muddy grey-beige rather than shadow. `filter` also creates a new containing block, which can surprise sticky descendants.

**Depth:** `z-index` ascends with card order. The receding card drops one shadow level so the stack reads as one pile of paper rather than four floating panels. Implemented as an opacity crossfade between two stacked pseudo-elements.

**Card contents** — kicker, title, copy, tags, button — rise 14px and fade in as the card reaches rest, staggered 60ms apart top to bottom. 420ms, `cubic-bezier(.22,.9,.25,1)`. **Runs once per card; does not replay on scroll up**, unlike the recede. The asymmetry is intentional.

**Scroll range:** the recede for card *n* maps to the window in which card *n+1* travels its last 100% of viewport height — `animation-timeline: view()` with `animation-range: cover 0% cover 100%`, falling back to `IntersectionObserver` + `rAF`.

**Hover:** `translateY(−4px)` over 250ms.

#### Edge cases

| Condition | Behaviour |
|---|---|
| `prefers-reduced-motion` | Scale, translate and stagger dropped. Cards still stick, they just don't shrink. |
| Below 760px | No stacking. Plain vertical list, image above text, full width. A sticky pile fights mobile browser chrome. |
| Keyboard / deep link | `scroll-margin-top: 88px` per section. Every card fully readable and focusable at rest with no motion played. |
| Last card | Does not recede — nothing covers it. Hands off to the contact section below. |

---

## 7. Case study template

Content is authored per case study; this section specifies the shell.

### 7.1 Sticky index rail

Fixed to the right side, listing every section heading as a jump link.

| State | Treatment |
|---|---|
| Rest | Muted slate text |
| Hover | Darkens to full espresso |
| Active | Darkens, weight 500, gains a marker on the rail |

**Implementation:** `position: sticky; top: 128px`. Active state driven by `IntersectionObserver` scrollspy with `rootMargin: -40% 0px -55% 0px`, so a section activates when roughly centred rather than the instant its top edge appears. Real `<a href="#id">` elements, for keyboard navigation and deep linking. `scroll-behavior: smooth`, disabled under `prefers-reduced-motion`.

**Below 1100px the rail is removed entirely** — there is not room for a rail plus a readable content column. Optional fallback: a thin progress bar at the top of the viewport.

### 7.2 Narrative structure

The conventional case study order (problem → research → ideation → wireframes → final → takeaways) reads as process compliance and makes portfolios indistinguishable. This template departs from it deliberately.

- **Lead with the stakes, not the brief.** Open with what was at risk or what changed, then work backward.
- **Section headings are framed as tension, not phase.** "What we assumed" → "What was actually happening", not "Research". "Three directions, one survivor", not "Ideation".
- **Every case study includes a decision that went wrong.** This is the highest-signal content available: hiring managers read for judgment, and most portfolios omit failure entirely.
- **Show artifacts, don't describe them.** The annotated affinity board, not a sentence about affinity mapping.
- **Vary the rhythm.** Alternate long analytical passages with short ones, pull quotes, and full-bleed visuals.

### 7.3 Reusable interaction components

Two or three per case study — not all of them. More than three and the interactions compete with the content.

| Component | Use |
|---|---|
| Before/after slider | Draggable divider across old and new. Strongest single interaction for a redesign. |
| Annotated hotspots | Numbered pins on a screenshot; click reveals the rationale for that decision. |
| Iteration strip | Horizontal scroll through v1 → v2 → v3, so evolution is visible rather than claimed. |
| Count-up metrics | Numbers animate on scroll into view. |
| Building flow diagram | Nodes and arrows draw in on scroll rather than appearing whole. |

---

## 8. About page

Written in first person throughout.

**Framing problem this page exists to solve:** three degrees in data science, psychology and information science read as scattered unless the page makes them read as deliberate. The About page is an argument, not a biography.

**Visual language:** the page is decorated with the artifacts of designing — Figma-style selection handles, component pills, spacing annotations, hand-drawn marker arrows. It demonstrates fluency rather than claiming it.

### 8.1 Hero photo

A photograph that crossfades to a second photograph on hover.

- Both images stacked absolutely, animating `opacity`. Swapping `src` flashes on first hover while the second image loads.
- Preload the alternate image.
- No hover on touch: either swap on tap, or accept that mobile sees only the first image.
- Surrounded by design-tool chrome — corner selection handles, a small component pill, a spacing annotation.

### 8.2 Thesis

A short paragraph positioning psychology, data science and information science as a single method rather than three unrelated qualifications: psychology explains why people behave as they do, data shows whether they actually did, information science makes it findable, and design is where the three become a decision.

**Highlighter sweep on scroll.** Key sentences receive a marker stroke that draws left to right as they enter view — a background gradient animating `background-size` from `0% 100%` to `100% 100%`, triggered by `IntersectionObserver`, once per element. The highlight must stay low-opacity so text contrast holds. **Two or three sentences only** — highlighting everything highlights nothing.

### 8.3 How I think — the curve

A hand-drawn SVG wave running left to right through five circled nodes, with handwritten-style labels and small marker arrows pointing at each.

The five nodes are verbs, not phase names. "Research / analysis / ideation / development / testing" is the generic version of the same sequence.

| Node | What it represents | Tools shown |
|---|---|---|
| listen | The psychology half — who is struggling, and what it feels like | user interviews, affinity mapping, Dovetail |
| check | The data science half — does behavioural data agree with what people said | SQL, Python, Amplitude |
| sketch | Fast, cheap, wrong on purpose | Figma, prototyping, design systems |
| build | Prototyping in code — the hybrid claim made concrete | React, TypeScript, Vue |
| watch | Back to observation, which makes the line a loop rather than an arrow | usability testing, Maze, session replay |

Read top to bottom this is a skills list that never appears as a skills list — embedded in process rather than presented as a wall of logos.

**Curve entrance:** draws in on scroll via `stroke-dasharray` / `stroke-dashoffset`, with nodes popping in as the line reaches each one. Once only.

**Non-linearity:** optionally add one faint return stroke — `watch` back to `listen`, or a short loop between `check` and `sketch`. One backward line only; two turns it into spaghetti.

**Node interaction.** All five nodes are interactive. If only some respond, the inert ones read as broken.

- Hover on desktop, tap on touch — **same payload either way**: a small card containing one line about that step plus tool chips. A hover-for-tools / click-for-note split would make the tools unreachable on touch.
- Tool chips reuse the pill component from the hero, tying the two pages together and exercising the component twice.
- Card anchored beside its node, flipping side near viewport edges so it never clips.
- ~120ms delay on show, none on hide. The delay prevents flicker when the cursor crosses a node on its way elsewhere.
- One card open at a time.
- Nodes are real `<button>` elements. Focus shows the card; Escape closes it.
- Note text lives in the DOM at rest, height-animated rather than `display: none`, so it remains readable if scripting fails.

### 8.4 Beyond design

A grid, not a pile — the same personality, but it reads as considered rather than casual. Contains photographs of work and photographs taken.

- Mixed 2×1 and 1×1 tiles, `grid-auto-flow: dense` so gaps backfill rather than leaving holes.
- Odd tiles tilt `+2°`, even tiles `−2°`, so no two neighbours lean the same way.
- Captions fade in on hover. Nothing shouts at rest.
- Rotated tiles overflow their grid cells — allow enough gap that neighbours don't clip.
- The hover transform must re-declare the rotation, or tiles snap flat.

### 8.5 Currently reading

A single card: book cover at left; title, a personal one- or two-line note, a progress bar with percentage, and a "since [month]" label.

The note carries this component. A title alone says nothing; the note is where the personality is.

**Maintenance risk, stated explicitly:** the progress bar makes staleness more visible, not less. "48% since August" still showing in March reads as an abandoned site more loudly than a bare title would. Either commit to updating it or drop the percentage and keep the note.

### 8.6 Closing statement

> **What I'm looking for now**
>
> I want to work somewhere the design and the build aren't separate jobs. My best work has happened when I could research a problem, prototype the answer in code, and sit with the engineers who shipped it — not hand off a file and hope.
>
> I'm looking for a team that takes user research seriously enough to let it change the roadmap, and that's fine with a designer who opens a pull request.

An earlier draft of this section was rejected for being generic — "partner in product thinking", "the why behind the what", "meaningful impact" — on a page whose entire purpose is demonstrating that she is not generic. The replacement names what she does and what she wants, which is what makes it sound like a person.

Followed by contact links and resume, so the visitor does not have to return to the nav.

---

## 9. Technical

**Stack:** React + Vite + TypeScript. Plain CSS with custom properties. No component library.

**Deployment:** GitHub repository → Vercel, auto-deploying on push to `main`. Vercel auto-detects Vite.

**Domain:** registered with Wix through 3 February 2027. DNS records in the Wix domain dashboard (separate from the site editor) repoint `@` and `www` at Vercel's A record and CNAME. Registration stays with Wix; only the destination changes. Vercel issues SSL automatically once it verifies the domain.

**Build sequence:** nav → hero → projects → case study shell → about. One component per session, verified in the browser before moving on. The hero is the most complex item on the list and may need splitting into two passes — entry animation first, proximity system second, leaning pill last.

---

## 10. Open items

None of these block the build; placeholders are acceptable.

- Logo design
- Final tagline
- Which ten skills appear on the hero pills
- Which projects become case studies, and their content
- Tint and shade ramps derived from the base palette
- Whether the curve gets a return stroke, and where
