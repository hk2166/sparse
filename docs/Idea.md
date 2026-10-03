# TheSparseLabs — Landing Page Content Script

> This is the copy, not a description of the copy. Everything between the section rules is written to be pasted into a build.
>
> **Rule for whoever builds this:** no number appears on this page that isn't sourced. Where a fact still needs confirming it is marked `[[TODO]]`. Ship the page with a `[[TODO]]` still in it and we've published a guess.

---

## Brand context

**Name:** TheSparseLabs
**What we are:** A small product lab. We find things that hurt in real work, build the smallest thing that stops the hurt, and put it in front of people.
**The constraint:** Nothing ships that can't ship in 15 days.
**Voice:** First person plural. Warm, plain, specific. Short sentences. We sound like people who build things, not a company that announces things.

**What this page is actually arguing:** the method is the product. Three unrelated pieces of software — a whiteboard, a shop till, a search API — only make sense as one story if the reader believes in the way they were made. So the page sells the loop, and the products are the evidence.

**The villain:** software that takes a year to ship and solves a pain nobody had.

### Build conventions (for whoever implements this)

The project is already set up; follow what's there rather than introducing a fourth way of doing things.

- **shadcn/ui** is initialised — Base UI primitives, `base-nova` preset, Lucide icons, config in `components.json`. Components land in `src/components/ui`. Add with `bunx --bun shadcn@latest add <slug>`.
- **wensity** is also initialised — `wensity.json`, registry `ui.wensity.com`, components would land in `src/components/wensity`.
- **Theming lives entirely in `src/app/globals.css`.** A tweakcn theme is applied: semantic tokens (`--primary`, `--background`, `--muted`, `--card`, `--border`, plus chart and sidebar scales) defined in `:root` with a full `.dark` override, mapped into Tailwind through `@theme inline`. **Use those tokens.** Do not hardcode hex values in components, and do not create a parallel colour system — the whole point of the pattern is that one file re-themes the page.
- Note the theme also redefines `--spacing` to `0.24rem` (Tailwind's default is `0.25rem`), so every `p-*`, `gap-*` and `m-*` is 4% tighter than stock. That's deliberate; don't "fix" it.
- Fonts: **Inter** via `next/font`, wired to `--font-sans`. `--font-mono` is a system stack.
- **Magic UI** is wired in as a registry, not a package — `"@magicui": "https://magicui.design/r/{name}"` under `registries` in `components.json`. Components are copied into `src/components/ui` and then owned and edited locally; several already are (`bento-grid`, `marquee`, `terminal`, `safari`, `iphone`, `globe`, `animated-list`). Add with `bunx --bun shadcn@latest add @magicui/<slug>`. Where a copied component is edited away from upstream, say why in a comment at the point of the change — `bento-grid.tsx` and `animated-list.tsx` both do.

### Voice rules

- Write what a thing does, not what category it belongs to. "Exports your diagram as SQL you can run" beats "powerful export capabilities."
- Never describe ourselves as innovative, cutting-edge, passionate, or AI-native. Show the work instead.
- No ALL-CAPS labels above headings. No `A · B · C` strings joined with middle dots. No arrows glued to button text.
- A button says what happens when you press it.
- If a sentence would survive on any other company's site, delete it.

---

## 1. Navigation

**Wordmark:** TheSparseLabs

**Links:** Products, Method, Open source, Contact
*(Four separate links, sentence case, laid out with spacing. Do not join them with middle dots — the commas here are list punctuation for this document, not a separator to render.)*

**Button:** Tell us what hurts

*Job: get out of the way. The page has one real CTA and the nav carries it.*

---

## 2. Hero

**Headline:**
> We ship simple software for painful problems.

**Subhead:**
> TheSparseLabs is a small product lab. We look for the things that quietly ruin a workday, build the smallest thing that stops it, and put it in front of the people who have the problem.

**The constraint, set apart as its own line:**
> Nothing ships that can't ship in 15 days. That isn't a schedule. It's a filter — if an idea can't survive being that small, it isn't the right idea yet.

**Primary button:** See what we've built
**Secondary button:** Tell us what hurts

*Job: answer "what kind of company is this" in one read. Do not put product names here — the hero sells the method.*

*Build note: no stat strip, no counters. We have three products; a metrics row would be an empty brag. The ledger in §6 is the proof.*

---

## 3. The villain

**Headline:**
> Most software arrives too late to matter.

**Everything else in this section is the feed.** There is no body copy. The three paragraphs that used to sit here said out loud what the rows now show, and a reader who has just watched a launch land in month eleven does not need to be told it was slow.

---

### The feed

One frame, one queue, running on a loop. Rows arrive at the top, push the rest down, and fade out at the floor of the frame. It starts when the section scrolls into view and never finishes.

**The timestamp column is the argument.** Read it as it goes past and it runs months, then minutes, then days. Nothing is labelled "slow" or "wasteful" — the reader does that arithmetic themselves, which is the only way they'll believe it.

Nine rows in this order, looping. Each is an icon, a title, when it happened, and one line underneath.

| | icon | title | when | underneath |
|---|---|---|---|---|
| **a year** | people | Discovery kickoff | month 1 | Twelve people, one hour |
| | document | Requirements, revised | month 4 | Third version this quarter |
| | megaphone | Launch | month 11 | The question changed in month three |
| **an afternoon** | sparkles | Prompt, then a product | 2m ago | Nobody ran it past a user |
| | rocket | Deployed to production | 31m ago | Forty-one files, none of them read |
| | ghost | Still nobody has opened it | 40m ago | It solved nothing |
| **fifteen days** | eye | Noticed the friction | day 1 | Someone's fourth workaround |
| | scissors | Cut to one thing | day 4 | Everything else waits |
| | send | **Shipped** | day 15 | A thing you can open |

The group labels in that table are for whoever builds it. **They are not rendered** — the durations are not headings any more, they are three runs of rows inside one stream.

The order is deliberate and the loop is the point. Ceremony piles up and launches into an empty room; slop ships in an afternoon to nobody; then the same problem goes through the loop and something real lands on day fifteen. Then it starts again, because it does.

The last three rows are Notice, Cut and Ship from §4 under different names, so the next section reads as the mechanism behind something the reader has already watched happen.

**Build notes:**

- **Feed on the left, half the width.** The right column is deliberately empty until its counterpart visual exists — a placeholder box would only look unfinished. On mobile the feed centres and takes the full column.
- **No frame around the feed.** The rows are already cards; a border around a column of bordered cards reads as a box someone forgot to remove.
- **Close the seam with the hero.** The hero's surface is `--card` and this section's is `--background` — different values in both themes — so they meet on a hard line just under the globe. The hero's own dissolve resolves to `--card` on purpose, so it stays independent of whatever follows; closing the rest of the gap is this section's job, with a tall `--card` → transparent ramp at its top edge. Tall enough that the ramp never reads as a band in its own right.
- **The frame has a fixed height and hides its overflow.** Rows are emitted forever; without a ceiling the page grows by a row every tick. A gradient tied to the section background fades the oldest rows out at the floor rather than clipping them on a hard edge.
- **Keep more rows mounted than the frame can show**, so the oldest leaves from behind the fade instead of popping out in view.
- **Glass rows:** translucent card over the section surface, hairline border, blurred behind, with a lift in light mode and an inner top-glow in dark. Build the shadows with `color-mix` on `--foreground` rather than a hardcoded `rgba`, so they re-theme with everything else.
- **Colour comes from the theme's `--chart-1` … `--chart-5` scales**, which have a full `.dark` override. Hue deliberately carries no meaning: the light and dark scales do not map onto each other — `--chart-3` is magenta in light and green in dark — so anything load-bearing would invert on a theme switch. The icon and the timestamp carry the meaning. Colour is only there to stop nine rows reading as one grey wall.
- **One exception, and it is the point:** the `Shipped` row is the only `--primary` tile in the stream. One colour among the chart scales marks the row the whole page is arguing for.
- **Tinted tiles, not solid fills.** `--chart-2` and `--chart-5` sit around 0.67–0.75 lightness, and a white glyph on those fails contrast in light mode. A 15% wash with the full-strength icon on top reads as colourful at a glance and survives both themes.
- **No middle dot between title and timestamp** — the two sit at opposite ends of the row. The reference implementation joins them with a `·`; the voice rules above say not to.
- **Reduced motion gets the whole list at once, and no loop.** An endless animation is the exact thing that setting is asking to stop, and the rows are content, not decoration, so they cannot be withheld behind a trigger that never fires.

*Job: give the reader something to agree with before asking them to believe anything about us. Name both failure modes — the slow one and the slop one — because the reader has met both.*

*Two earlier versions are worth not going back to. The first drew three bars comparing the durations, which could only say one is longer than another — something a caption already says in words. The second put three feeds in three bento cards with the paragraphs underneath; the cards fought each other for the same point, and the paragraphs said out loud what the rows were already showing. If a visual in this section can be replaced by its own caption, it is not carrying anything — and if the caption can be replaced by the visual, cut the caption.*

---

## 4. The loop

**Headline:**
> How fifteen days works

**Subhead:**
> Four steps. We run them again the moment we're done.

**Step 1 — Notice**
> We start from friction, not from ideas. Someone doing real work hits the same wall for the fourth time and works around it instead of complaining. That workaround is the brief.

**Step 2 — Cut**
> Then we take things away. What is the smallest version that actually ends the problem? If the answer needs a roadmap, it's the wrong problem or we haven't understood it yet.

**Step 3 — Ship**
> Fifteen days, and it goes out. Small enough to finish, real enough to use. Not a beta list, not a waitlist — a thing you can open.

**Step 4 — Listen**
> Then we find out whether we were right. People use it or they don't, and both answers are useful. Some products get a second fifteen days. Some get put down.

*Job: this is the substrate. Without it, §6 is a directory of unrelated software. Numbered markers are legitimate here — it's genuinely a sequence.*

---

## 5. What we build

**Headline:**
> Whatever shape the problem is

**Subhead:**
> The loop doesn't care what form the answer takes. Some problems need an application. Some need one endpoint. Some need a command you type once and forget about.

**The five shapes:**

**Web applications**
> Full products that live in a browser. Real software, not a landing page with a form behind it.

**Mobile apps**
> For the problems that only happen away from a desk. Shops, sites, vans, waiting rooms.

**Command-line tools**
> Sometimes the honest answer to a problem is forty lines you run in a terminal. No dashboard, no account, no onboarding — it just does the thing and exits.

**API endpoints**
> Infrastructure for other people's software. If the thing that hurts is something your own product needs and can't get, we'll build the service rather than the interface.

**Micro-browser products**
> Small, single-purpose tools that open in a tab and solve exactly one thing. No signup, no install. You use it, it works, you close it.

**Closing line:**
> We pick the shape after we understand the problem, never before. Deciding you're building a mobile app and then going looking for a reason is how the year-long roadmaps start.

*Job: this is the section that licenses everything else. It's why a whiteboard, a shop till and a search API can sit on one page without the reader wondering what kind of company this is. It also sets up the last two ledger cards, which promise more of exactly these shapes.*

*Build note: five short blocks, equal weight, no icons unless they genuinely help — five generic glyphs in five identical cards is the templated look the voice rules ban. Type and spacing alone will carry it. Do not order these by importance; they're alternatives, not a hierarchy.*

---

## 6. The ledger

**Headline:**
> What we've built so far

**Subhead:**
> Three products, three different shapes. A whiteboard, a shop till, and a search API. What they have in common is the loop, not the category.

**Build note:** rows, not cards. A dated ledger reads as a system starting up; a grid of three cards reads as a thin portfolio. Columns: product, the pain it kills, shape, status, link.

---

### Row 1 — godraw

- **What hurts:** You're designing a database and the diagram lives in one tool, the schema in another. They drift apart within a week, and the diagram becomes a lie.
- **What it does:** An infinite canvas for drawing systems. Draw the tables in crow's-foot notation and export SQL you can actually run — Postgres, MySQL, SQLite. Or point it at a schema you already have and get the diagram back.
- **Also does:** freehand drawing, shapes, sticky notes, mind maps, math, live collaboration with cursors and voice, presentation mode, and it keeps working offline.
- **Shape:** Web app
- **Status:** Live
- **Link:** godraw.app
- **Repo:** Private — the product link is the proof here, not the source
- **Shipped:** `[[TODO: confirm godraw's public launch date for the ledger]]`

### Row 2 — Muneem

- **Tagline:** Invoicing that works everywhere.
- **What hurts:** The shop's internet drops and the till stops taking money. Cloud billing software assumes a connection that a lot of Indian retail simply doesn't have.
- **What it does:** Billing, inventory and accounting for Indian retail and wholesale shops, built offline-first. The shop's own computer is the system of record. GST invoices, barcode scanners, thermal printers, cash drawers, credit tracking, double-entry books. The cloud is for backup and reporting, not for permission to make a sale.
- **The line that matters:** Your business keeps running even when the internet doesn't.
- **Shape:** Desktop application with a cloud API
- **Status:** In development, built in the open
- **Repo:** Public — github.com/thesparselabs/muneem. This is the only one you can read end to end, so it carries the whole "open by default" claim in §8.

### Row 3 — Sextant

- **What hurts:** Agents are only as good as the web context they can pull in, and most tools scrape someone else's search results — which means a latency floor, a dependency that can cut you off, and no real retrieval.
- **What it does:** A web search and extraction API for AI agents, built on our own index rather than somebody else's results page. Search the live web, pull clean Markdown out of any page, get answers you can check.
- **One detail we're proud of:** every response tells you how good the data was. A `coverage` field says high, partial or low — when we don't have good results we say so, instead of padding the list with weak matches.
- **Shape:** API
- **Status:** Launching soon
- **Repo:** Private
- **Row copy:** Close enough that we're arguing about the docs rather than the code.

---

### Row 4 — In the pipeline

- **Headline for the card:** More in the workshop
- **Copy:** Several things are mid-build right now. Some will make it out, some won't — that's what the loop is for. The ones that survive land here with a date on them.
- **Status:** In progress
- **No link.** A card with nothing to click is honest; a card linking to a waitlist is not.

### Row 5 — What comes after

- **Headline for the card:** More of all five
- **Copy:** More SaaS and micro-SaaS. More command-line tools. More endpoints, more mobile, more small things that open in a tab. Every shape in §5 has something behind it — this row is where they'll appear once they're real enough to have a date.
- **Status:** Ongoing
- **No link.**

*Job of rows 4 and 5: the ledger has to end on the clock still running, or the cadence reads as history instead of a habit. Row 4 says "we are building right now"; row 5 points back at §5 and says "and it won't only be more of the same three." Don't restate the five shapes here — §5 already did, and repeating them makes both sections weaker.*

*Build note: rows 4 and 5 are visually distinct from rows 1–3 — no status dot, no date, dimmer surface, maybe a dashed border. They are promises, not receipts, and the design should not let them be mistaken for shipped products.*

---

## 7. One product, properly

**Headline:**
> A closer look at godraw

**Subhead:**
> The ledger shows the cadence. This shows the work.

**Body:**
> Every developer has drawn the same database twice. Once in the diagramming tool, to think. Once in SQL, to build. Then the schema changes and only one of them gets updated, so the picture on the wall slowly becomes fiction.
>
> godraw collapses that into one step. Draw the tables, the columns, the keys and the relationships in proper crow's-foot notation, and export DDL that runs on Postgres, MySQL or SQLite. Already have a schema? Import it and get a diagram that matches reality, because it came from reality.
>
> Around that sits an ordinary, good infinite canvas — freehand, shapes, arrows that route themselves, sticky notes, mind maps, code blocks, math. Live cursors and voice chat when you're working with someone. A presentation mode for when the sketch becomes the meeting. And it works offline, syncing when you're back.

**Pull quote — godraw's own line, and we keep it:**
> Free and always will be. If it saved you time, a small tip funds the servers and the next feature.

**Button:** Open godraw

*Job: a ledger proves we ship often. It does not prove we ship well. One deep cut does.*

*Build note: this section needs one real screenshot of the ER-to-SQL export. It's the single most specific thing on the page.*

---

## 8. Open by default

**Headline:**
> You should be able to see inside

**Body:**
> We build in public where we can. Muneem's code is on GitHub as it's being written — not a polished drop after the fact, the actual work. You can read how the money arithmetic is done, disagree with a decision, and say so. This site is public too, for whatever that's worth.
>
> Not everything is. godraw and Sextant are closed for now, and we'd rather say that plainly than let "open by default" imply more than it does. The direction is one way, though: things get opened as they stabilise, not sealed as they grow.
>
> That isn't a favour we're asking for. It's the thing that makes the rest of this page safe to believe. Software from a lab this small is a reasonable thing to be nervous about, and the honest answer to that nervousness isn't a promise — it's access.

**The concrete door:**
> If you want to help: the open repos are listed below, issues are the best place to start, and a pull request from a stranger is the best day of our week.

**Links:**
- github.com/thesparselabs/muneem
- github.com/thesparselabs/sparse

*Job: this is load-bearing for §9 and must come before it. "Open" is what turns "built to be acquired" from a threat into a non-event.*

> **⚠ Blocker — resolve before this page goes live.**
> Neither `muneem` nor `sparse` currently has a LICENSE file, which means both are all-rights-reserved by default and nobody can legally fork or contribute. This section is not true until an MIT or Apache-2.0 licence lands on both repos. Five minutes of work; do it before launch.
>
> Separately, godraw's meta description and structured data describe it as **open source**, but its repository is private — so the claim is live on the product site and isn't true. Either open the repo or fix the metadata. Don't let this page amplify it.

---

## 9. What happens after we ship

**Headline:**
> We build things to be handed on

**Body:**
> We'll say the quiet part plainly, because you'd find out anyway: these products are built to be acquired. A lab that ships every fifteen days cannot also run twelve products forever, and pretending otherwise would be how they all slowly get worse.
>
> When something we built finds a team that can take it further than we can, that's the good outcome. Not the exit — the continuity. The product gets people who'll look after it full time.
>
> The fair question is what that means for you if you're using it. Here's the answer, and it's mechanical rather than reassuring:
>
> - **Your data leaves whenever you want.** Export is a feature we build first, not a concession we add when people complain.
> - **The code is public where it can be.** If a product is open and you're depending on it, an acquisition doesn't strand you. You can run it yourself.
> - **We say so out loud.** No quiet handover, no "exciting news" post that turns out to mean the service closes in thirty days.
>
> We'd rather tell you this on the front page than have you discover it later.

*Job: objection-handling, not a boast. The reader's fear isn't "you'll sell" — it's "my work dies." Answer that specific fear, mechanically. §8 is what makes these three bullets true; without open repos, bullet two is a sentence we can't cash.*

---

## 10. Meet the lab

**Headline:**
> The people who actually build this

**Subhead:**
> A small group of engineers in India. Small on purpose — fifteen days only works if nobody has to be told what's going on.

**Body, above the grid:**
> There's no product team handing specs to an engineering team. The person who notices the problem is usually the person who ships the fix, which is why the products are opinionated and why they're small.

---

### Person card — template

Each person gets the same four things. Keep it short; this is a lab, not a leadership page.

- **Name**
- **Role** — plain words. "Builds the desktop app" beats "Senior Full-Stack Engineer."
- **One line** — what they're into, what they're responsible for, or what they built before this. A little personality is the point.
- **Links** — GitHub, and optionally X or a personal site.

**Fill these in:**

> `[[TODO: the founders — name, role, one line, links. This page argues hard for a method; a reader who agrees will want to know who is running it.]]`
>
> `[[TODO: the engineers — same four fields each. The user says there are several; name all of them. A lab that names one person and hides the rest behind "we" is a solo project wearing a company's clothes, and readers spot it.]]`

**Closing line under the grid:**
> We're not trying to become large. We're trying to stay small enough that shipping in fifteen days is still physically possible.

*Job: when the metrics are thin, the people are the proof. Transistor's entire landing page runs on named humans and zero usage numbers, and it works. This section is what makes the confident claims above land as a point of view rather than as marketing.*

*Build note: real faces or nothing. Generated avatars or letter-monograms on a page arguing this hard for honesty will read badly. If photos aren't available yet, ship names and links on a plain typographic grid — that looks deliberate, whereas placeholder avatars look unfinished.*

---

## 11. Send us a problem

**Headline:**
> Tell us what breaks in your week

**Subhead:**
> This is the most useful thing on the page, and it's the only one that's aimed at you rather than at us. Every product in that ledger started as someone describing a bad afternoon.

**Body:**
> We're not looking for product ideas. We're looking for the thing you've already built a workaround for — the spreadsheet that shouldn't exist, the step you do by hand every Thursday, the tool you keep open only because the other one can't do one thing. You stopped complaining about it a while ago. That's the one.
>
> Describe the problem, not the solution. If you've already designed the fix in your head, tell us anyway, but lead with what hurts. We're better at the second part than you'd expect and worse at guessing the first part than we'd like.

---

### The form

**Field 1**
- **Label:** What breaks?
- **Placeholder:** The thing that goes wrong, as plainly as you can put it.
- **Type:** Textarea, required

**Field 2**
- **Label:** What do you do instead today?
- **Helper text under the label:** The workaround is the important part. People only build workarounds for things that genuinely hurt.
- **Placeholder:** Even if the answer is "nothing, I just put up with it."
- **Type:** Textarea, required

**Field 3**
- **Label:** Where can we reach you?
- **Placeholder:** you@example.com
- **Type:** Email, required

**Button:** Send it

**Under the button, small:**
> We only use this to reply. No list, no newsletter, nothing forwarded to anyone.

---

### What happens next

> A real person reads every one of these. That's not a figure of speech yet — there aren't enough of them for it to be.
>
> We reply to the ones we might be able to build, and we try to say no clearly to the rest rather than going quiet. If your problem turns into something on that ledger:
>
> - **You get named as the person who found it**, on the product and here, unless you'd rather we didn't.
> - **You get it first** — before the launch, while it's still easy to change.
> - **We build it with you, not at you.** You had the problem; you're the one who can tell us when we've solved the wrong half of it.

**Direct contact, for people who'd rather not use a form:**
> `[[TODO: contact email]]` — same inbox, same person reading it.

---

*Job: this section is the input to §4 step one. The page opens by claiming we find real problems; this is where the reader supplies one, which closes the loop. It replaces the old "two doors" split — people who just want to use something already have an "Open godraw" button in §7, so the closing section can be aimed entirely at the more valuable audience.*

**Build notes:**

- **The form needs somewhere to go.** Three options, cheapest first: an external service (Formspree, Tally) with no backend code; a Next.js Server Action writing to a database or forwarding by email; or no form at all and just the `mailto:` link. Whichever is chosen, a form that silently drops submissions is worse than no form — if it can't be wired up properly before launch, ship the email address alone and add the form later.
- **Spam.** A public form with an email field will get scraped. A honeypot field plus a simple rate limit is enough at this scale; don't put a CAPTCHA on it, it undercuts the tone of the whole page.
- **It has to work without JavaScript** if the rest of the page is server-rendered — a plain form post, progressively enhanced. Same reasoning as everywhere else on this page.
- **Write the success state, don't skip it.** After submitting, the form is replaced with: *"Got it. We read these properly, so give us a few days."* Failure state: *"That didn't send. Try again, or email us at `[[TODO: contact email]]`."* Never a bare "Error."
- Keep the three fields. Every extra field costs submissions, and the workaround question is the one that separates real pain from idle wishes.

---

## 12. Footer

**Brand line:** TheSparseLabs — we ship simple software for painful problems.

**Columns** *(each item is its own link on its own line — not a run-on string)*:

- **Products:** godraw, Muneem, Sextant
- **Lab:** Method, Open source, Contact
- **Code:** github.com/thesparselabs

**Bottom line:** © 2026 TheSparseLabs. Built in the open, in India.

*Build note: if it's cheap to do, show each public repo's last-commit date here. It's the most honest cadence receipt on the page and it updates itself without anyone maintaining it.*

---

## Appendix — things to fix before this page is public

Not copy. A checklist, because several of these are claims this page would amplify.

1. **Add a LICENSE to `muneem` and `sparse`.** Until then §8 is not true.
2. **godraw's "open source" claim** appears in its meta description and JSON-LD, but the repo is private. Open it or fix the metadata.
3. **godraw's trust logos** (IIT Madras, Meta, Kyptronix) aren't verifiable. The Meta one is the kind of claim that gets challenged publicly. Remove unless there's something in writing.
4. **`thesparselabs.com` doesn't currently resolve**, though the GitHub org points at it.
5. **Name collisions worth knowing about.** `muneemji.app` is live right now as a different Indian personal-finance product, and several GST-billing brands use the name — "Muneem Ji" is contested, `muneem.app` is unregistered. "Sextant" is crowded with at least five other developer tools, one of which markets itself as "No LLM." And "Sparse Labs" already has search history: a 2014 Indian logistics startup acquired by Zomato in 2016.
6. **Confirm godraw's launch date** for the ledger row.
7. **Decide what row 4 says.** A named product is better than a placeholder, but an honest blank is better than a fake name.
8. **Decide where the §11 form submits.** External service, Server Action, or no form and just the email address. A form that silently drops submissions is worse than no form — and §11 promises a real person reads every one, so whatever is chosen has to actually reach an inbox someone opens.
9. **Honour the credit promise or remove it.** §11 says submitters get named and get early access. That's a commitment to keep track of who sent what. If there's no intention of maintaining that, cut those bullets rather than publishing them.

### Sources for every factual claim above

- godraw's features, pricing and the "free and always will be" line: `plus.godraw.app` and `godraw.app`, fetched 2026-09-28, both returning 200.
- Muneem's description, the offline-first promise and the architecture details: its own PRD and README in `github.com/thesparselabs/muneem`.
- Sextant's one-liner, the `coverage` field and the index-not-SERP positioning: its README and `docs/00-introduction/01-vision.md`.
- Live/not-live status of every domain: `curl`, 2026-09-28. `sextant.dev`, `api.sextant.dev`, `muneem.app`, `api.muneem.app` and `thesparselabs.com` did not resolve.
- Repo visibility and licence status: `gh repo view`, 2026-09-28.
