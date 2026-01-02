/**
 * Background image paths for different sections
 * These images are downloaded from Unsplash and optimized locally
 */
export const BACKGROUND_IMAGES = {
  aboutHero: '/images/backgrounds/about-hero.webp',
  contactHero: '/images/backgrounds/contact-hero.webp',
  faqsHero: '/images/backgrounds/faqs-hero.webp',
  postsHero: '/images/backgrounds/posts-hero.webp',
  shippingHero: '/images/backgrounds/shipping-hero.webp',
  contactFormBg: '/images/backgrounds/contact-form-bg.webp',
  brandShowcaseBg: '/images/backgrounds/brand-showcase-bg.webp',
} as const;

/**
 * Get background image path by key
 */
export function getBackgroundImage(key: keyof typeof BACKGROUND_IMAGES): string {
  return BACKGROUND_IMAGES[key] || '/images/placeholder-image.svg';
}









