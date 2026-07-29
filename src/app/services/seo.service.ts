import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  setSeoData(data: { title: string, description: string, keywords?: string, ogImage?: string, route?: string }) {
    // Title
    const fullTitle = `${data.title} | SM Incubators`;
    this.title.setTitle(fullTitle);

    // Meta descriptions
    this.meta.updateTag({ name: 'description', content: data.description });
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    if (data.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: data.ogImage });
    }
    
    // Canonical
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
    const url = `https://sm-incubators.vercel.app${route || '/'}`;
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
