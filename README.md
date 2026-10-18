# The Spiritual Dove

A travel & spirituality journal built with [Astro](https://astro.build). Static, fast, and easy to grow: every destination and story is a Markdown file.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs static site to dist/
npm run preview   # serve the built site
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). Set your real domain in `astro.config.mjs` (`site`).

## Where to edit things

| What | File |
| --- | --- |
| Brand name, author name/photo, Instagram, email, form integrations | `src/config/site.ts` |
| Place categories & story categories | `src/config/site.ts` |
| Destinations | `src/content/places/*.md` |
| Stories | `src/content/stories/*.md` |
| Home hero image | top of `src/pages/index.astro` |
| About page text & principles | `src/pages/about.astro` |
| Colours, fonts, spacing | `src/styles/global.css` (`:root` tokens) |

## Add a destination

Copy any file in `src/content/places/`, rename it (the filename becomes the URL, e.g. `kedarnath.md` becomes `/places/kedarnath/`), and edit the fields:

- `category` must be one of the place categories in `site.ts`.
- `practical.verified: true` (plus `lastChecked: "March 2027"`) once you have personally checked the visitor details. Until then the page shows a "not yet verified" notice.
- `sample: false` removes the "Sample destination" banner once the page is yours.
- `nearby` lists other place filenames (without `.md`).

## Add a story

Copy a file in `src/content/stories/`, write in Markdown below the `---` block. Reading time is calculated automatically. `places` links the story to destinations, and it then appears on those destination pages as a related story. Set `featured: true` to show it on the home page.

## Itinerary and gallery

A place can have a day-by-day `itinerary` (see `src/content/places/vrindavan.md`): each day lists its stops, and a stop can have an optional `note`. When a place has an itinerary it replaces the "Things to see" cards, and a **Gallery** appears with one slot per stop.

**Visitor guide for each stop.** Tapping a gallery tile opens a guide for that stop with four parts, all optional: `find` (a list: what you'll find there), `visit` (how to visit), `matters` (why it matters) and `expect` (what to expect when you arrive). Add them under the stop in `src/content/places/vrindavan.md`. A stop with none of these shows "The guide for this stop is still being written."

To give a stop **several photos with captions**, list them under the stop as `photos` (see Chandrodaya Mandir in `src/content/places/vrindavan.md`). The first photo is the cover on the gallery tile; the rest appear as thumbnails in the guide.

A photo entry can instead be a short **video**: set `video` to the file (for example `/videos/places/vrindavan/clip.mp4`) and `src` to a poster image. Keep clips short and small (a few MB, MP4 / H.264) so the page stays fast.

To add a single photo to a gallery slot, drop the image into `public/images/places/<place>/` and name it after the stop in lowercase with dashes (`&` becomes `and`). For example, for Vrindavan:

- `Chandrodaya Mandir` becomes `public/images/places/vrindavan/chandrodaya-mandir.jpg`
- `Prem Mandir & Market` becomes `public/images/places/vrindavan/prem-mandir-and-market.jpg`
- `Banke Bihari Ji Temple` becomes `public/images/places/vrindavan/banke-bihari-ji-temple.jpg`

`.jpg`, `.jpeg`, `.png` and `.webp` all work. If you rename a stop in the itinerary, rename its photo to match. Places without an itinerary show a gallery only once at least one photo has been added.

## Photographs

The site ships with illustrated landscapes so nothing looks broken before you have photos. To use your own:

1. Put the image in `public/images/places/` (or `stories/`, `author/`).
2. In the content file, add `image: /images/places/hampi.jpg` under `cover:` and update `alt`. Add `credit:` if needed.

Recommended: landscape images around 2000px wide, compressed (JPEG/WebP, ideally under 400KB).

## Newsletter & contact form

Nothing is collected until you connect a service. Both forms tell visitors honestly that they are not active yet.

- **Newsletter:** paste your provider's form action URL into `site.newsletter.formAction` (Buttondown, Kit, Mailchimp, etc.). Adjust `emailFieldName` if your provider expects something other than `email`.
- **Collaborate form:** paste a form endpoint (e.g. Formspree) into `site.contactForm.formAction`. If you only set `contactEmail`, the form opens a pre-filled email instead.
- Update `src/pages/privacy.astro` whenever you connect a service.

## Content honesty

All destinations and stories are marked as **sample content**. Background facts are general and worth checking. Practical details (timings, fees, permits) are intentionally phrased as "verify before visiting". Nothing claims the author visited a place. Personal experiences belong in Stories, not on the destination pages.

## Archive

`archive/` holds content that is parked, not published. To bring Amritsar back, move `archive/places/amritsar.md` into `src/content/places/` and `archive/images/amritsar.jpg` into `public/images/places/`. Check you have the right to publish that photo first.
