import { getCollection, type CollectionEntry } from 'astro:content';

export type Place = CollectionEntry<'places'>;
export type Story = CollectionEntry<'stories'>;

export async function getPlaces(): Promise<Place[]> {
  const places = await getCollection('places');
  return places.sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.title.localeCompare(b.data.title));
}

export async function getStories(): Promise<Story[]> {
  const stories = await getCollection('stories');
  return stories.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export function formatLocation(p: Place['data']): string {
  return [p.city, p.state, p.country].filter(Boolean).join(', ');
}

export function readingTime(body = ''): string {
  const words = body.replace(/[#>*_`\-\[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
