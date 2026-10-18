import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site as brand } from '../config/site';

export async function GET(context) {
  const stories = (await getCollection('stories')).sort((a, b) => b.data.publishDate - a.data.publishDate);
  return rss({
    title: `${brand.name} — Stories`,
    description: brand.description,
    site: context.site,
    items: stories.map((s) => ({
      title: s.data.title,
      description: s.data.excerpt,
      pubDate: s.data.publishDate,
      link: `/stories/${s.id}/`,
    })),
  });
}
