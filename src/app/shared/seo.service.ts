import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export const SITE_URL = 'https://paziresh.me';
export const PERSON_NAME = 'Ali Reza Paziresh';
export const DEFAULT_TITLE = 'Ali Reza Paziresh — Startup Founder & Software Engineer';
export const DEFAULT_DESCRIPTION =
  'Ali Reza Paziresh is a startup founder and software engineer in Tehran, Iran, writing about software engineering, entrepreneurship, and startups.';
export const DEFAULT_IMAGE = `${SITE_URL}/website-preview.png`;

export interface SeoData {
  /** Page-specific title, e.g. "Journey". Rendered as "{title} — Ali Reza Paziresh". */
  title: string;
  description: string;
  /** Site-relative path with leading and trailing slash, e.g. "/journey/". */
  path: string;
  image?: string;
  type?: 'website' | 'article';
  /** type: 'article' only. */
  publishedTime?: string;
  section?: string;
}

// Angular's Meta service only manages <meta> tags, not <link> tags, so
// <link rel="canonical"> needs to be updated by hand on every route —
// otherwise every page keeps the homepage canonical baked into index.html
// and tells Google the whole site is a duplicate of "/".
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private titleService: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  set(data: SeoData): void {
    const url = `${SITE_URL}${data.path}`;
    const image = data.image ?? DEFAULT_IMAGE;

    this.titleService.setTitle(`${data.title} — ${PERSON_NAME}`);
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: data.type ?? 'website' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    if (data.type === 'article') {
      this.meta.updateTag({ property: 'article:author', content: PERSON_NAME });
      if (data.publishedTime) this.meta.updateTag({ property: 'article:published_time', content: data.publishedTime });
      if (data.section) this.meta.updateTag({ property: 'article:section', content: data.section });
    } else {
      this.meta.removeTag('property="article:published_time"');
      this.meta.removeTag('property="article:author"');
      this.meta.removeTag('property="article:section"');
    }

    this.setCanonical(url);
  }

  /** Restores the homepage defaults — call from ngOnDestroy on any route that calls set(). */
  reset(): void {
    this.titleService.setTitle(`${DEFAULT_TITLE}`);
    this.meta.updateTag({ name: 'description', content: DEFAULT_DESCRIPTION });
    this.meta.updateTag({ property: 'og:title', content: DEFAULT_TITLE });
    this.meta.updateTag({ property: 'og:description', content: DEFAULT_DESCRIPTION });
    this.meta.updateTag({ property: 'og:image', content: DEFAULT_IMAGE });
    this.meta.updateTag({ property: 'og:url', content: `${SITE_URL}/` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:title', content: DEFAULT_TITLE });
    this.meta.updateTag({ name: 'twitter:description', content: DEFAULT_DESCRIPTION });
    this.meta.updateTag({ name: 'twitter:image', content: DEFAULT_IMAGE });
    this.meta.removeTag('property="article:published_time"');
    this.meta.removeTag('property="article:author"');
    this.meta.removeTag('property="article:section"');
    this.setCanonical(`${SITE_URL}/`);
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
