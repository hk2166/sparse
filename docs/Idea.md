# TheSparseLabs — Landing Page Build Brief

> Hand this file directly to Claude Code as the reference spec. It contains brand context, build order, copy, component notes, and library hints.

---

## 🎯 Brand Context (read first)

**Name:** TheSparseLabs
**Tagline direction:** "We ship simple software for painful problems."
**What we are:** A product lab that identifies real-world pain points, ships a micro/macro SaaS every 1–2 months, validates with users, and lets the best ones get acquired by VCs or bigger players.
**Voice:** Confident, minimal, slightly witty. No fluff. Short sentences. Think Linear × Vercel × indie hacker energy.
**Design theme:** Dark-first, sparse (pun intended), lots of whitespace, one accent color, mono/sans mix.

---

## 🧱 Build Order — Sections (top → bottom)

### 1. `<Navbar />`
- Left: `TheSparseLabs` wordmark (Phosphorus `Atom` or `Flask` icon + text)
- Center/Right links: `Products` · `Lab Notes` · `About` · `Contact`
- Right CTA button: **"Suggest an Idea"** (scrolls to idea-drop section)
- Sticky, blur backdrop on scroll.
- Library: plain React + Phosphorus icons (`List` for mobile menu).

### 2. `<Hero />`
- **Eyebrow pill:** `● A product lab — shipping every 1–2 months`
- **Headline (H1):**
  > We find painful problems.  
  > We ship simple solutions.
- **Subhead:**
  > TheSparseLabs is a small, AI-native studio building micro and macro SaaS products that solve real-world problems — one launch at a time.
- **Primary CTA:** `Explore Products ↓`
- **Secondary CTA:** `Drop an Idea →`
- **Live stat strip (below CTA):**
  - `4 products shipped`
  - `~60 days / launch`
  - `2 acquired`
  - `∞ ideas in queue`
- **Visual:** animated sparse dot-grid / particle field.
- Library: `react-bits` → `Particles`, `DotGrid`, or `Aurora` background. Keep it subtle.

### 3. `<ManifestoStrip />` (short band)
- 3–4 inline statements, large type, scroll-revealed:
  > **Sparse by default.**  
  > **Simple beats clever.**  
  > **Ship, validate, move on.**  
  > **Built to be acquired.**
- Library: `react-bits` → `ScrollReveal` / `SplitText`.

### 4. `<HowWeWork />` (process — 4 steps)
Horizontal or vertical stepper:
1. **Observe** — We hunt for recurring pain in real workflows.
2. **Distill** — Cut it to the simplest possible solution.
3. **Ship** — AI-native build. Launch in weeks, not quarters.
4. **Validate** — Users love it? Investors acquire it? We double down or sunset.
- Icons: Phosphorus `Eye`, `FunnelSimple`, `Rocket`, `ChartLineUp`.

### 5. `<Products />` — *the core section*
Section header:
> **The Lab Output**  
> Micro and macro SaaS, shipped every 1–2 months.

Grid of product cards (3 columns desktop, 1 mobile). Each card:

```tsx
<ProductCard
  status="live" | "beta" | "coming-soon" | "acquired"
  name="<Product Name>"
  tagline="<One-line pain → solution>"
  category="Micro SaaS" | "Macro SaaS"
  icon={<PhosphorusIcon />}
  metrics={{ users: "1.2k", mrr: "$4.2k" }}   // optional
  href="/products/<slug>"
/>