# Fog to firelight - creative direction for brycerambach.com

Date: 2026-09-03
Status: for Bryce's review. No code until he approves.
Builds on the Oak and Clay spec (2026-08-30) and the fog forest note
(2026-09-03). Everything in those still stands unless this note says
otherwise.

## What's there now

The build on `redesign/fog-forest` is six sections in file order:
HeroDawn, WorkSection, MadeSection, OffTheClockSection, VibeBoardSection,
AfterDarkSection. Every one uses the same container (`max-w-6xl`, `px-6`,
`py-28`, `py-40` on desktop, `lg:pl-32`) and four of the six are a
two-column grid with text on the left and one photograph on the right.
That's the landing-page feeling in a sentence. The identity lives in the
materials (paper, oak ink, Fraunces, Plex Mono, Caveat, tape, prints, the
day-arc) and the materials are good. The layout under them is a template.

What works and stays:

- The day-arc. Body colour lerps through five stops measured off the real
  section positions, nav ink flips on `html[data-arc]`, the corner clock
  winds 5:47 am to 11:58 pm. The brief says make it more apparent, not
  different.
- The motion system in `lib/motion.ts`: two tiers, the overshoot ladder
  (scatter 1.2 < settle 1.35 < stamp 1.4), the mist entrance, rationed
  statement moves, reduced motion at three layers.
- The hero photograph, the wordmark entrance, the fog banks on 52s and 64s
  clocks, the scroll-linked fog thinning.
- The print language: Polaroid (paper frame, tape, Caveat caption, drift in
  the frame, lift under the cursor, drag on desktop), InkNote (clip-path
  write-on), the engraved SVG line (911, fir, stars, moon), the dot-leader
  index.
- The copy voice.

What's holding it back:

- Nothing crosses a boundary. Objects live inside their section's box.
  Nothing pins. No scroll passage lasts longer than one entrance.
- Every entrance is triggered once (`viewport once`), so the page plays at
  you. Only the fog and the photo drift are scrubbed to your hand.
- The torn paper edge ends the forest with a line. The fog doesn't lift
  into anything. It stops.
- The work section is a paragraph and a stock-looking desk. It says "I have
  a job", not "this is how I think".
- The index is honest but inert: four rows, no evidence.
- Running sits at oak dusk next to a Porsche. He runs at dawn, and the car
  is a want, not a run.
- The vibe board is six items in a three-column grid with 32px gaps. Tidy
  is the opposite of a collection.
- "brisbane, australia" and "sf or nyc · soon" (twice) are out of date.
- Photography is all codex stand-ins. The landscapes hold up. The desk
  doesn't.

Not checked: pinned (`position: sticky`) passages driven by Motion's
`useScroll` on top of Lenis haven't been tried on this stack, so that's the
first spike of the build. Device testing is still emulated widths only. The
3px overflow at 390px from the last session is still there and gets
absorbed by the hero rebuild.

## The idea

One day on foot. You start in the fog, walk out of the trees onto a sheet
of paper where the day gets laid out, and when the light goes the trees
come back around a fire.

Three materials, each owning part of the day:

- **The forest.** Photography, full bleed, atmospheric. Owns dawn and
  night. It's the frame.
- **The sheet.** One continuous piece of paper. Not sections in boxes, a
  surface things get put down on. Owns the daylight.
- **The ink.** Oak type, mono annotations, handwriting, the engraved line.
  It draws itself, and it's the only thing allowed to connect one part of
  the day to another.

Two rules fall out of that.

**Places are photographed, things are drawn.** Tahoe, the fog, a clay
court, a beach at dusk: photographs. A 911, a route, a boarding pass, a
system diagram: ink. The 911 is both, which is fine. The photograph is the
want and the engraving is the plan.

**The day is the spine, the desk is the surface.** On 2026-08-30 a "Field
Journal" direction was declined as the whole identity. This isn't that. Oak
and Clay stays the identity. What changes is the behaviour of the page:
things get taped down, stacked, picked up and put away over the course of
a day.

### One structural change: the run moves to first light

He runs before the sun's up. The site currently runs him at oak dusk next
to a car. Moving the run to right after the hero fixes the mismatch and
does something better: the fog lifts and you're on the trail. The hero
subline says "run before the sun's up"; the next thing you see is the run.
Then the day's work.

The order becomes: the fog (5:47 am) → first light, the run (6:40) → the
work (9:00) → things I've made (1:00 pm) → things I'm thinking about
(4:00) → the vibe board (7:00) → after dark (10:30) → goodnight (11:58).

The run passage is short, a story rather than a section, and arro's real
interface appears here beside its reason before the index names it. If
you'd rather keep the brief's order (run at dusk, between the thinking and
the vibe board) everything below still works. Only moment 2's light changes
from sunrise to alpenglow.

## The scrolling model

Four kinds of thing, with rules for each.

**Scenes.** Full-bleed photographic, pinned, scrubbed to scroll. Two of
them: the fog at the top and the trees returning at the bottom. A scene is
at most 1.8 viewports of scroll.

**The sheet.** The paper between the scenes. No section containers. One
twelve-column grid, and content may cross column gutters and chapter
boundaries. Chapters are marked only by a quiet mono label and by what the
clock says. The padding rhythm varies on purpose: the work is tight, the
margin is empty, the drawer is crowded.

**Passages.** Pinned sequences with a scroll-driven timeline: first light,
the wiring, the bench. A passage is a sticky container 1.5 to 2.5
viewports tall. Scroll progress drives every move inside it through
`useScroll` and `useTransform`, so scrolling back undoes them. Three rules.
Scrubbed moves don't overshoot; overshoot belongs to triggered moves, and
on a scrub it reads as lag. A passage never hides content behind unreached
progress, so scroll fast and the resting composition is fully there. Under
reduced motion a passage is just its resting composition.

**Objects.** Prints, scraps, cards, the diagram, the sun. They're physical:
taped, stacked, picked up, slid, flipped, put away. Objects are what cross
boundaries. The trail print from first light overlaps the top of the work.
The bench's stack sits in the thinking section's margin. The boarding pass
in the drawer takes you to after dark. The trees at night rise into the
drawer's bottom edge.

Depth: two planes on the sheet (paper, objects) plus the scenes. Parallax
stays where it already is (photos inside their frames) and gains the hero's
nearest fir. Nothing else parallaxes.

The motion tiers stay exactly as `lib/motion.ts` has them. Passages add a
third mode, scrubbed, alongside triggered and ambient. Ambient loops stay
between 12 and 64 seconds and named after behaviour.

## The day, retuned

The colour stops move so the light reads as a whole day rather than three
hours. The clock keeps its linear map from 5:47 am to 11:58 pm. The stops
anchor to the chapters' real positions the way DayArc already measures
them.

| chapter | clock | ground |
|---|---|---|
| the fog | 5:47 am | photograph, dissolving into fog-cream paper `#F2EBDD` |
| first light | ~6:40 am | sunrise paper, a blush: `#F4E3CF` (the one new stop) |
| the work | ~9:00 am | paper `#F2EBDD`, brightest on the page; shafts gone by mid-morning |
| the bench | ~1:00 pm | flat midday, paperwarm `#F7F3EA` |
| the margin | ~4:00 pm | golden `#E8C98F` |
| the vibe board | ~7:00 pm | oak dusk `#1C3527` into fir blue hour `#132624` across its length |
| after dark | ~10:30 pm | forest night `#0D1712` |
| goodnight | 11:58 pm | night |

Golden moves from the work to the afternoon. The work gets the brightest
paper on the page, which is true to 9 am.

## The journey: eleven moments

Each moment answers the same four things: what you see, what happens as
you scroll or interact, what it reveals about him, and why it belongs in
the story. Clock times are where the corner clock will read.

### 1. The fog lifts · 5:47 am

**What you see.** The fog forest. `bryce.` set huge and low-left, "welcome
in" with its arrow, the subline, and the mono line now reading `san
francisco, california`. No torn paper edge. The scene is pinned for about
1.8 viewports.

**What happens.** As you scroll, four things run together, all scrubbed to
your hand. The two fog banks thin (built). The nearest fir, cut from the
same photograph with one hand-drawn mask, moves a few percent slower than
the ridge behind it, and the wordmark sits between the two: the tree's top
boughs cross the `e`, so the type is in the forest rather than on it.
Morning strengthens: a warm light from the upper right rises from nothing
to a soft wash, and the cool shadow under the trees lifts. The type
responds slightly: the wordmark drifts up a touch faster than the trees
(it's nearer), and as it leaves it goes back into the mist, the mist
entrance played in reverse. Then the dissolve. The bottom of the
photograph is masked, not torn, and the last fog bank sits exactly at the
seam. The fog is the paper's colour, so you don't leave the forest. You
walk down out of the trees onto the sheet. The clay full stop stays behind
for a beat, then glides to the bottom-left corner and becomes the sun on
the clock's arc (moment 10). "the fog lifts as you scroll" stays, set in
the fog.

**What it reveals.** San Francisco. The outdoors. Someone who'd rather show
you a place than a headline.

**Why it belongs.** It's the frame. The day starts in the forest and the
forest is where we'll end. And it turns the site's best line into
something that literally happens.

### 2. First light, the run · 6:40 am

**What you see.** Blush paper. The meadow-trail print (the golden trail
into the pines), wide, taped down, overlapping the seam where the fog
dissolved. The label `first light`, the heading "Out before the fog
lifts." in Fraunces italic, and the streak number set big: a Fraunces
numeral, not a word inside a sentence. Beside it, a phone-shaped card
showing this week in arro, rebuilt from arro's own spec (the streak rings,
the day pills, the family row). The trio of firs from the old vibe-board
card becomes this chapter's mark.

**What happens.** The passage pins for about 1.5 viewports. The light warms
from blush to full paper as you scroll: the sun coming up over the sheet.
The streak numeral counts from 1 to today's number, scrubbed to scroll, so
the days are under your thumb and scrolling back takes them away. A route
draws itself onto the trail print in clay, a marker on a photo, with a
mono stamp beside it: `5:52 am · 6.2 km · every day` (placeholders for his
real numbers). The arro card's rings fill as the passage completes. The
copy stays: "The streak started as a bet with myself and became a family
ritual. Day 218 and counting. arro exists so the flame stays lit."

**What it reveals.** Runs early, every day. It's a family thing. He built
the app for it, and you see the app before the index names it.

**Why it belongs.** His day starts here, so the site's day starts here. It
fixes the dusk mismatch and puts arro's evidence next to its reason.

Mobile: no pin. The print, then the numeral, then the card, in a column.
The card is the only thing that animates (rings fill on entry).

### 3. The wiring · 9:00 am

**What you see.** The brightest paper on the page. `the work`, "Systems,
wired together." pinned centre-left, and nothing else at first. The desk
photo is gone. The work section owns no photograph at all: the forest owns
photography, the day owns ink.

**What happens.** A passage of about 2.5 viewports. As you scroll,
fragments arrive around the heading in oak ink. Paper labels for the real
systems in plain words: `payroll`, `HR`, `finance`, `rostering`, `the
bank`, `the timesheet app`. Engraved lines between them that draw with
scroll (`pathLength`). Small mono scraps beside the lines: `employee.id →
worker_id`, `PATCH /leave-balances`, `retry 3x, then tell a human`, a
two-line terminal `$ sync payroll --dry-run`. Halfway through it's a
tangle: lines crossing, labels at angles, scraps stacked. Hover a label
and its wires go clay and the mapping nearest it comes forward. At about
80% the tangle resolves. The lines re-route into clean orthogonal wires
through one hub, the labels straighten into a row, the scraps tuck under.
Then the body copy settles: "By day I wire payroll, HR and finance
platforms together at Digital Directions. The kind of plumbing nobody
notices, which is the point." One more line after the tidy, Fraunces
italic: "Every one of these systems is good at its job. None of them know
the others exist." And a Caveat note in clay, inked last: "this is the
problem I can't put down."

**What it reveals.** What he does all day, that he likes taking a mess and
making it coherent, and the obsession under the job.

**Why it belongs.** It's the professional core and it's the through-line.
The same question shows up in the margin at 4 pm and in whatever he builds
next.

Mobile: the diagram renders resolved. The tangle state is desktop only.

### 4. The bench · 1:00 pm

**What you see.** `things I've made` and the dot-leader index, unchanged as
the spine on the left: four rows, Fraunces name, italic one-liner, leader,
mono tag. To its right, an empty bench on flat midday paper.

**What happens.** The index pins. As you scroll, one row at a time becomes
the active row (its leader dots march) and that project's evidence slides
onto the bench from the right. The bench pans sideways while the page
scrolls down. Three or four physical things per project, landing on the
house scatter curve:

- arro: the Today screen rebuilt in HTML (rings, day pills, one cheer),
  taped at 2°. A scrap with the problem. A scrap with the unfinished
  thought.
- trace: a terminal tailing `~/.claude/projects/*.jsonl`, a row count
  ticking, a sliver of the Today view. Scraps.
- throughline: a Slack-shaped draft standup with one line struck through
  in red pen, and its own test in mono: `sent as-is 4 days out of 5`.
- bryce-os: the three-lane Today card (needs you / opportunities / set
  aside) and a rule card: `never surface again · fired 14×`.

When the next row goes active, the previous project's things don't leave.
They slide back and dim a little. By the fourth row the bench is full.
Hover a row on desktop and its top item lifts before you've scrolled to
it. "take a look →" stays wherever there's somewhere to go.

Draft "why I built it" lines, from the READMEs. They're his reasons, so
they're his to correct:

- arro: "the streak was mine until it wasn't. a ring for each of us, and
  now nobody wants to be the one who breaks it." Unfinished: "should a
  streak ever be allowed to pause?"
- trace: "I build things at midnight and forget what I built by lunch. the
  sessions were already on disk; nobody was reading them." Unfinished:
  "what if it read everyone's sessions, not just mine?"
- throughline: "if the tool watched the day closely enough, the standup
  should write itself." Unfinished: "the standup is the first artifact.
  the second is the one nobody writes: the why."
- bryce-os: "every app wants my attention and none of them know what the
  others already told me. one inbox, rules that always win, a button that
  says never again." Unfinished: "an OS for one person is a demo. the
  version for everyone is a different company."

**What it reveals.** He can't stop making things, each one around a
problem in his own life, and he cares how they feel.

**Why it belongs.** It's the evidence for the claim the whole site makes.

Mobile: the rows stay. Each row is followed by a horizontal swipe rail of
its items, the one place the page moves sideways on a phone.

### 5. Putting the bench away · 2:30 pm

**What you see.** The bench is full: fourteen things overlapping.

**What happens.** As the passage releases, the pile tidies itself.
Everything squares up and slides into one neat stack, which drifts to the
right margin and stays there, sticky and small, as the thinking section
begins. It's still there while you read the questions. When the margin
ends, the stack slides off the sheet. One visual idea physically becoming
the next, and the only triggered move in the section, on the settle curve.

**What it reveals.** Tidiness after the mess. The same instinct as moment
3.

**Why it belongs.** The brief asked for the projects to pile up before
resolving into the next section. This is the resolve, and it carries the
projects into the thinking they came from.

### 6. The margin · 4:00 pm

**What you see.** The composition changes entirely. The sheet goes golden
and mostly empty, and the content moves to the margins: questions in
Fraunces italic at different sizes, a few on scraps of paper pinned at odd
angles, one written in Caveat. Label: `things I'm thinking about`. A mono
line: `as of september 2026`. The questions: "what happens to the IDE when
writing code isn't the hard part?" / "why does every piece of software
know only the thing directly in front of it?" / "what would I build if I
knew I couldn't fail?" / "how much of software should disappear entirely?"
Two drafts for him to keep or cut: "what does a computer look like when it
knows the whole person?" / "who's building the thing I'd actually use?"

**What happens.** The scraps drift very slowly, ±3px on 20 to 30 second
clocks, paper in a draught. Hover one and it comes forward, straightens,
and shows the second line underneath in mono, the unfinished half (draft,
under the IDE question: "reading is. deciding is. the editor optimises the
wrong hour."). They're draggable like the prints. One long Caveat line is
written by your scroll: the clip-path ink-in the site already has,
scrubbed instead of triggered, so scrolling back un-writes it and you're
watching him think. One question rotates by the day of the year, so a
return visit reads differently. The stack from moment 5 sits in the right
margin the whole time, then leaves.

**What it reveals.** What computing becomes next, ambition, and the honest
state: figuring out what to build.

**Why it belongs.** It's the "now" of the person without a biography, and
it's the second appearance of the question moment 3 planted.

Mobile: no drift, tap to reveal the second line, no drag.

### 7. The vibe board, opened like a drawer · 7:00 pm

**What you see.** The heading stays: "The vibe board." and "Things I love,
things I'm after. It's the same list." The ground has gone oak and is
heading for blue hour. Below, a drawer's worth of things, hand-placed,
overlapping, rotations from -6° to +5°, one half off the sheet's edge.
Different paper stocks: a polaroid, a 4×6 glossy, a contact strip, a torn
magazine page, a card, a stub. Around sixteen objects.

Photographs (places): Tahoe at alpenglow, pines and lake (new). San
Francisco fog at dusk, the top of Sutro Tower or the bridge above it (new).
An Australian beach at dusk (new). The clay court (have). The 911 in the
fog (have, moved here from off the clock). The snowboard at dusk (have).

Ink (things): the 911 engraving card, fig. 07 (have, moved here). A
boarding pass stub, BNE → SFO, mono type. A torn corner of a topographic
map, contours in oak ink, a route in clay. A paint-chip card, "oak green
over cognac". A pencil-style sketch of the sun complication on graph
paper. A tennis scorecard scrap (`6-4 3-6 7-5 · clay · lost the
tiebreak`, placeholder). The note "next: san francisco." A receipt-style
list, "things I'm chasing": a G-body 911, a sub-20 5k, a flat with a view
of the fog, the thing I'm building (placeholders). A scrap "the best thing
I used this year: ______" for the software he admires. And one print face
down.

**What happens.** Drag (built). Pick up (built). Flip: some prints have
writing on the back. Click or tap turns the print over on a rotateY and
the back shows a place, a date, a line in Caveat. Expand: click the map
and it unfolds to the front at 1.6×. Lead somewhere: the boarding pass
takes you to after dark, the sketch takes you back to the bench. Some
things are tucked under others; drag the top one and there's writing
beneath. Light: across the drawer's length the ground runs oak into blue
hour, so the top of the pile is dusk and the bottom is night.

Curated, not arranged: one paper palette, one ink language, and a hidden
order (places on the left half, things on the right) so the pile reads as
one person's.

**What it reveals.** Tahoe, San Francisco, Australia, clay, cars, beautiful
things, what he's chasing, and that he collects.

**Why it belongs.** It's the "who" without a biography, and it's the
section that makes the day feel lived in.

Real photos beat generated ones here. The drawer takes any size. If he has
a Tahoe, a court, an SF hill or a family run, it goes in and a codex print
comes out.

Mobile: a loose two-column pile, rotations kept, drag off (it fights
scroll), tap to flip, tap to expand.

### 8. The light goes · 8:40 pm

**What you see.** The drawer closing. The ground is blue hour.

**What happens.** The trees come back. Dark fir silhouettes rise from the
bottom corners into the drawer's last rows, scrubbed to scroll, the forest
returning at the edges. The first firefly appears here, one, then three by
the time the chair section starts, six at the fire. The stars over after
dark come out one at a time with scroll instead of all at once. The clock
reads 8:40, then 9:15. The sun on the corner arc has dropped below its
line; at the fire it becomes the ember. Ambient details accumulate.
Nothing announces itself.

**What it reveals.** That you've spent a day here.

**Why it belongs.** The brief wants the arc felt, not stated. This is the
transition where the visitor notices the light has been going the whole
time.

### 9. Pull up a chair · 10:30 pm

**What you see.** Kept: `after dark`, "Pull up a chair.", the copy, "say
hi →", the email, github. The campfire print with "the good part of the
day". Changed: the city polaroid is San Francisco now, "next stop →" /
"san francisco · soon". New: the trunks of the returned trees catch the
fire's light, a warm radial glow from the print onto the ground, the
warm-on-dark accent from his own library notes.

**What happens.** "made it." inks in. The fireflies see you out. The last
line, "the forest keeps going · goodnight", and under it a quiet link,
"see you at 5:47 ↑", back to the fog. The day is a loop.

**What it reveals.** Beach fires, company, an open invitation, the move.

**Why it belongs.** It's already the strongest part of the site. It gets
to be the end of a story instead of the bottom of a page.

### 10. Things that stay with you · all day

**What you see.** The chrome. The fir top-left, five quiet words top-right
(`run · work · made · now · say hi`), and bottom-left the clock, now with
a small engraved arc beside it and the clay sun on it.

**What happens.** The sun is the one object that persists across the whole
day. It starts as the wordmark's full stop, detaches as the hero leaves,
and rides the arc through the day: high and small at the bench, low and
gold in the drawer, below the line after dark, the ember at the fire.
It's scrubbed, tiny, and lives in the chrome. It never roams over content.
Hover the clock and it shows the real time in San Francisco, "it's 4:12 pm
in san francisco", computed from the visitor's clock. The tab title still
changes when you leave: "the fog rolls in."

**What it reveals.** The move, the day, care in small places.

**Why it belongs.** The brief asked for objects that persist while the
background changes. An almanac puts a sun-position glyph in its margin,
and this is that. If it reads as a mascot in the prototype, it's a day's
work to cut and the clock stands alone.

### 11. Things you find · any time

Not a section. The small things someone discovers rather than sees.

- Poke a letter of the wordmark and it hops (built).
- The face-down print in the drawer. Flip it and the back says "you found
  the one I didn't caption."
- One thinking question rotates by the day of the year.
- The streak number is live (built).
- Hover the 911 engraving and its lamp turns on (built).
- A scrap in the drawer: an engraved hare, crossed out in clay, "retired ·
  sept 2026". Only if he wants it. It's an affectionate footnote to the
  last two weeks.
- The clock's San Francisco time on hover.
- "see you at 5:47 ↑" at the very end.

## What changes in the build

No code yet. This is the shape.

Sections: OffTheClockSection retires (its streak sentence goes to first
light, the 911 goes to the drawer). New: FirstLight (passage), Wiring
(passage), Bench (passage), Margin, Drawer (VibeBoardSection rebuilt),
NightReturn (scene). HeroDawn is rebuilt as a pinned scene and the
torn-edge constant goes. AfterDarkSection keeps its copy.

Primitives: Passage (sticky container exposing scroll progress to its
children), Scene, the Object family (Print with flip, Scrap, Card, Stub),
Wiring (SVG with scroll-drawn paths and hover state), SunArc (the clock
complication), Trees (the silhouette layer). Existing ones stay: Polaroid
becomes Print, InkNote gains a scrubbed mode, StreakNumber gains a
scrubbed mode, Fireflies gains a count, FirMark, DayClock gains the SF
hover, DayArc gains the blush stop and the new anchors, SettleWords,
Settle. EnvelopeReveal stays for the campfire, or retires if the fire gets
the fog mask too.

Data: `site.ts` grows. Projects gain `why`, `unfinished` and an artifact
spec. A `questions` list. A `drawer` list with object kinds. The San
Francisco facts.

Assets out: `desk-6pm.jpg`. In: three codex landscapes (Tahoe alpenglow,
San Francisco fog at dusk, an Australian beach at dusk) and one San
Francisco night for the polaroid that replaces `city-dusk.jpg`. Everything
else is ink. The OG card gets reshot.

Copy: `san francisco, california`, the JSON-LD address, "san francisco ·
soon" twice, and the new headings and lines above.

Tests: section tests follow the copy. New unit tests for the passage
progress maths, the sun-arc position, the day-of-year question, and the
day-arc's new stop.

## Responsive, reduced motion, performance

- Passages un-pin below `md` and flow. The bench becomes swipe rails, the
  drawer a two-column pile with tap-to-flip, the wiring its resolved
  state. The hero keeps the dissolve and the fog thinning but not the fir
  cut.
- Reduced motion: scenes and passages render at their resting composition.
  No drift, no fireflies moving, the sun static at the current hour. The
  day-arc colour still follows scroll, since it's colour rather than
  motion, the same as today.
- Everything scrubbed is transform, opacity, clip-path or pathLength. No
  layout properties on scroll. Passages cap at 2.5 viewports so nobody
  gets stuck.
- Nothing here needs WebGL, canvas or a new dependency.

## Risks and what I didn't check

- Sticky passages on Lenis plus Motion `useScroll`: untested on this
  stack. First spike.
- The fir cut-out in the hero. If the mask edge shows, the depth idea drops
  back to fog-speed differences only.
- Performance with about sixteen draggable objects and about ten
  scroll-linked transforms on one page. To be measured, not assumed.
- Real photos: I don't know what he has.
- The sun complication is the one thing that could read as a gimmick. It's
  also the most reversible decision in the doc.
- The "why I built it" lines and the scraps are drafted from the READMEs.
  The voice is his to correct.

## Questions for Bryce

1. The run at first light (recommended), or at dusk in the brief's order?
2. Real photographs: any of Tahoe, San Francisco, a court, a run, or
   Australia you'd want in the drawer?
3. The "why I built it" lines: correct them, or give me the real reasons
   and I'll rewrite.
4. lucid isn't on the site. Does it stay off, or does the margin hint at
   it without naming it?
5. The persistent sun: in, or clock only?
6. arro's family card: placeholder initials, or first names?
