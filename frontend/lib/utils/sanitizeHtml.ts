/**
 * HTML Sanitization Utility
 * Uses DOMPurify to sanitize HTML content and prevent XSS attacks
 */

import DOMPurify from 'isomorphic-dompurify';
import type { Config } from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - Raw HTML string to sanitize
 * @param options - DOMPurify configuration options
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(
  html: string,
  options?: {
    allowImages?: boolean;
    allowLinks?: boolean;
    allowScripts?: boolean;
  }
): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Configure DOMPurify
  const config: Config = {
    // Allow common HTML tags
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'div', 'span', 'section', 'article',
    ],
    ALLOWED_ATTR: ['class', 'id', 'style'],
  };

  // Allow images if specified
  if (options?.allowImages) {
    config.ALLOWED_TAGS?.push('img');
    config.ALLOWED_ATTR?.push('src', 'alt', 'width', 'height', 'loading');
  }

  // Allow links if specified
  if (options?.allowLinks) {
    config.ALLOWED_TAGS?.push('a');
    config.ALLOWED_ATTR?.push('href', 'target', 'rel');
    // Ensure external links have rel="noopener noreferrer"
    config.ADD_ATTR = ['target'];
    config.ADD_URI_SAFE_ATTR = ['href'];
  }

  // Allow scripts ONLY for tracking scripts (use with extreme caution)
  if (options?.allowScripts) {
    config.ALLOWED_TAGS?.push('script');
    config.ALLOWED_ATTR?.push('src', 'async', 'defer', 'type', 'id');
    // ⚠️ WARNING: Allowing scripts is dangerous, only use for trusted CMS content
  }

  // Sanitize HTML
  const sanitized = DOMPurify.sanitize(html, config);

  return sanitized;
}

/**
 * Sanitize HTML for product descriptions and blog posts
 * Allows images and links but no scripts
 */
export function sanitizeContentHtml(html: string): string {
  return sanitizeHtml(html, {
    allowImages: true,
    allowLinks: true,
    allowScripts: false,
  });
}

/**
 * Sanitize HTML for tracking scripts (use with extreme caution)
 * Only use for trusted CMS content
 */
export function sanitizeTrackingScriptHtml(html: string): string {
  // For tracking scripts, we need to be more permissive
  // but still sanitize dangerous content
  const config: Config = {
    ALLOWED_TAGS: ['script', 'noscript', 'iframe'],
    ALLOWED_ATTR: ['src', 'async', 'defer', 'type', 'id', 'class', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
    // Allow data attributes for tracking scripts
    ALLOW_DATA_ATTR: true,
  };

  return DOMPurify.sanitize(html, config);
}


