# The Fog Forest - design note, 2026-09-03

Chosen on the "brycerambach.com, three ways" canvas over two rival nature
directions (the river, the ascent). Supersedes the hare layer of the Oak
and Clay build; everything else in that spec still stands.

## The idea

The forest is the site. Fog is the motion medium: it drifts on clocks too
slow to catch, and everything enters the way trees do in mist - blur
settling to sharp. The day-arc stays sacred and now reads as one forest
at three hours: dawn fog, golden shafts through the canopy, fireflies at
night.

## What left

The hare, wholesale: TrailRunner, HareMark, gait, pursuit, the trail
libs and their tests, the nav gallop, "follow the trail", "end of trail",
"the hare waits." Bryce's call on 2026-09-03: the site should be personal
and playful without a mascot. Roughly 1,000 lines and ~12 kB of bundle.

## What arrived

- **Hero**: `hero-fog.jpg` (codex, cream dawn sky over foggy conifers).
  Two fog banks drift on 52s/64s alternate clocks; a scroll-linked
  opacity thins them as you leave the hero, so "the fog lifts as you
  scroll" is literal. Wordmark keeps its hand-set letter entrance and
  gains a parent blur that clears as it settles.
- **Mist entrance**: `MIST_BLUR` + `mistTransition` in `lib/motion.ts`.
  SettleWords now surfaces word by word from blur (no rotation - fog
  drifts, it does not tilt). Reserved for display type; photographs and
  body copy never blur.
- **Fir mark** (`FirMark.tsx`): three stroked bough tiers, the same
  engraving language as the 911. Nav home link (breeze sway on hover,
  one gust, not a loop) and a trio on the vibe board ("out before the
  fog lifts").
- **Canopy shafts**: two skewed light beams on the work section's golden
  ground, drifting at 26s/34s.
- **Fireflies** (`Fireflies.tsx`): four gold points on 13s/17s clocks
  closing after dark - "the forest keeps going · goodnight".
- **Day-arc retune**: vibe-board hour `rgb(19,38,36)` (fir blue hour),
  night `rgb(13,23,18)` (forest night). Tokens `--color-bluehour` and
  `--color-night` moved with them.

## Rules carried forward

Two-tier motion with the overshoot ladder, reduced-motion at all three
layers, `viewport once` on every statement move, day-arc measured from
real section positions. Fog is a medium, never an effect: it appears in
the hero, the shafts, and nowhere else.
