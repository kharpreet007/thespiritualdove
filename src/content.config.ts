import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { placeCategories, storyCategories } from './config/site';

/**
 * Cover artwork. Add `image` (a path under /public, e.g. "/images/places/hampi.jpg")
 * to use a real photograph. Without it, an illustrated scene is drawn instead.
 */
const cover = z.object({
  image: z.string().optional(),
  alt: z.string(),
  credit: z.string().optional(),
  // Which part of the photo stays in view when cropped, e.g. "50% 40%" (x y).
  focus: z.string().default('50% 50%'),
  scene: z
    .enum([
      'himalaya',
      'ghats',
      'golden',
      'ruins',
      'riverhills',
      'bodhi',
      'gopuram',
      'valley',
      'island',
      'backwater',
      'lamp',
      'path',
      'stillness',
      'monastery',
      'yamuna',
    ])
    .default('himalaya'),
});

const places = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/places' }),
  schema: z.object({
    title: z.string(),
    city: z.string().optional(),
    state: z.string(),
    country: z.string().default('India'),
    region: z.string(),
    category: z.enum(placeCategories),
    excerpt: z.string(),
    cover,
    featured: z.boolean().default(false),
    // Marks entries written as sample/starter content. Shows a notice on the page.
    sample: z.boolean().default(true),
    intro: z.string(),
    history: z.string(),
    significance: z.string().optional(),
    // Your own notes from visiting. Leave empty to show an editable placeholder.
    personalNotes: z.string().optional(),
    highlights: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    // Map pin. Find coordinates by right-clicking the spot in Google Maps.
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
    address: z.string().optional(),
    // Where to stay. Booking-site search links are generated from `city` automatically.
    stay: z
      .object({
        intro: z.string().optional(),
        areas: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
        // Your own recommended hotels/guest houses. Leave empty to show a placeholder.
        recommended: z.array(z.object({ name: z.string(), note: z.string().optional(), url: z.string().optional() })).default([]),
      })
      .default({}),
    // How to get there and get around.
    transport: z
      .array(
        z.object({
          mode: z.enum(['air', 'rail', 'road', 'local']),
          title: z.string(),
          text: z.string(),
        })
      )
      .default([]),
    practical: z.object({
      howToReach: z.string().optional(),
      bestTime: z.string().optional(),
      timings: z.string().optional(),
      entry: z.string().optional(),
      // Set to true once you have checked these details yourself.
      verified: z.boolean().default(false),
      lastChecked: z.string().optional(),
    }),
    etiquette: z.array(z.string()).default([]),
    nearby: z.array(z.string()).default([]),
  }),
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(storyCategories),
    publishDate: z.coerce.date(),
    cover,
    featured: z.boolean().default(false),
    sample: z.boolean().default(true),
    places: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { places, stories };
