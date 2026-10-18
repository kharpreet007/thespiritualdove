/**
 * Central site settings. Edit this file to update brand details,
 * social links and form integrations in one place.
 */
export const site = {
  name: 'The Spiritual Dove',
  tagline: 'Every journey brings you closer to something deeper.',
  description:
    'A travel and spirituality journal exploring sacred places, local stories, and the meaning we find in the journeys we take.',
  authorTitle: 'Spiritual Travel Writer',

  // EDITABLE: your name as you want it shown. Leave empty to show only the title.
  authorName: '',

  // EDITABLE: path to your portrait in /public, e.g. '/images/author/portrait.jpg'.
  authorPhoto: '',

  instagram: {
    handle: '@thespiritualdove',
    url: 'https://www.instagram.com/thespiritualdove/',
  },

  // EDITABLE: a public email for collaborations. Leave empty until you have one.
  contactEmail: '',

  /**
   * Newsletter integration.
   * Paste the form "action" URL from your email provider (Buttondown, ConvertKit/Kit,
   * Mailchimp, Substack embed, etc.). While empty, the signup form explains honestly
   * that subscriptions are not open yet and stores nothing.
   */
  newsletter: {
    formAction: '',
    emailFieldName: 'email',
  },

  /**
   * Collaboration form integration.
   * Paste a form endpoint (e.g. Formspree, Basin, Netlify Forms) to receive messages.
   * If empty but contactEmail is set, the form opens a pre-filled email instead.
   * If both are empty, the form explains it is not connected yet.
   */
  contactForm: {
    formAction: '',
  },

  /**
   * Destination maps. When true, each place page embeds an interactive Google Map.
   * Building with PUBLIC_PREVIEW=1 turns it off (some preview hosts block embedded maps).
   */
  maps: {
    embed: !import.meta.env.PUBLIC_PREVIEW,
  },
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Places', href: '/places/' },
  { label: 'Stories', href: '/stories/' },
  { label: 'Collaborate', href: '/collaborate/' },
];

export const placeCategories = [
  'Sacred Places & Temples',
  'Spiritual Destinations',
  'Heritage & Culture',
  'Nature & Retreats',
  'Peaceful Escapes',
] as const;

export const storyCategories = [
  'Reflections',
  'Travel Stories',
  'Culture & Traditions',
  'Lessons from the Road',
  'Mindful Travel',
] as const;
