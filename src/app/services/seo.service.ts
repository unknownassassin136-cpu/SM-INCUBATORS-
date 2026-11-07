import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'product';
  route?: string;
  price?: number;
  availability?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  private siteBaseUrl = 'https://smincubators.in';
  private defaultImage = 'https://smincubators.in/assets/images/hero/main.jpeg';
  private siteName = 'SRI MAVULLAMMA INCUBATORS';

  setSeoData(data: SeoConfig) {
    const fullTitle = data.title.includes('SM Incubators')
      ? data.title
      : `${data.title} | ${this.siteName}`;

    // 1. Page Title
    this.title.setTitle(fullTitle);

    // 2. Standard Meta
    this.meta.updateTag({ name: 'description', content: data.description });
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // 3. Absolute URL computation for Open Graph & Social crawlers (WhatsApp, Facebook, Twitter)
    // Always use official live domain (https://smincubators.in) so external crawlers can fetch the card & image
    let cleanRoute = data.route;
    if (!cleanRoute) {
      cleanRoute = typeof window !== 'undefined' ? window.location.pathname : '/';
    } else if (cleanRoute.startsWith('http://') || cleanRoute.startsWith('https://')) {
      try {
        cleanRoute = new URL(cleanRoute).pathname;
      } catch {
        cleanRoute = '/';
      }
    }
    const absoluteUrl = `${this.siteBaseUrl}${cleanRoute.startsWith('/') ? cleanRoute : '/' + cleanRoute}`;

    // 4. Image absolute URL (Always pointing to live domain or CDN for scraper resolution)
    let absoluteImage = data.ogImage || this.defaultImage;
    if (!absoluteImage.startsWith('http://') && !absoluteImage.startsWith('https://')) {
      absoluteImage = `${this.siteBaseUrl}${absoluteImage.startsWith('/') ? '' : '/'}${absoluteImage}`;
    } else if (absoluteImage.includes('localhost') || absoluteImage.includes('127.0.0.1')) {
      try {
        const imgUrl = new URL(absoluteImage);
        absoluteImage = `${this.siteBaseUrl}${imgUrl.pathname}${imgUrl.search}`;
      } catch {
        absoluteImage = this.defaultImage;
      }
    }

    // 5. Open Graph Meta Tags (for WhatsApp, Facebook, LinkedIn previews)
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: absoluteUrl });
    this.meta.updateTag({ property: 'og:type', content: data.ogType || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:image', content: absoluteImage });
    this.meta.updateTag({ property: 'og:image:secure_url', content: absoluteImage });
    this.meta.updateTag({ property: 'og:image:alt', content: fullTitle });

    if (data.ogType === 'product' && data.price) {
      this.meta.updateTag({ property: 'product:price:amount', content: String(data.price) });
      this.meta.updateTag({ property: 'product:price:currency', content: 'INR' });
      this.meta.updateTag({ property: 'product:availability', content: data.availability || 'in stock' });
    }

    // 6. Twitter Card Meta Tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: absoluteImage });

    // 7. Canonical link
    this.setCanonicalUrl(data.route);
  }

  setStructuredData(schema: object) {
    let script = this.document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);
  }

  private setCanonicalUrl(route?: string) {
    let cleanRoute = route;
    if (!cleanRoute) {
      cleanRoute = typeof window !== 'undefined' ? window.location.pathname : '/';
    } else if (cleanRoute.startsWith('http://') || cleanRoute.startsWith('https://')) {
      try {
        cleanRoute = new URL(cleanRoute).pathname;
      } catch {
        cleanRoute = '/';
      }
    }
    const url = `${this.siteBaseUrl}${cleanRoute.startsWith('/') ? cleanRoute : '/' + cleanRoute}`;
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  // Web Share API support
  async shareNative(options: { title: string; text: string; url: string }): Promise<boolean> {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share(options);
        return true;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Native share failed, falling back', err);
        }
        return false;
      }
    }
    return false;
  }
}
