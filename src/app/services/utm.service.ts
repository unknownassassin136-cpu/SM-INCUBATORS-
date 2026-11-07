import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface UtmData {
  source: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrer?: string;
  firstTouchDate: string;
  landingPage: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtmService {
  private router = inject(Router);
  private storageKey = 'smi_utm_attribution';
  private currentUtm: UtmData | null = null;

  constructor() {
    this.initUtmTracking();
  }

  private initUtmTracking(): void {
    if (typeof window === 'undefined') return;

    // Load existing stored attribution if present
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.currentUtm = JSON.parse(saved);
      } catch {
        this.currentUtm = null;
      }
    }

    // Inspect URL query params on navigation
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.captureFromCurrentUrl();
      });

    // Run immediately on page load
    this.captureFromCurrentUrl();
  }

  private captureFromCurrentUrl(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get('utm_source') || urlParams.get('ref') || urlParams.get('source');
    const mediumParam = urlParams.get('utm_medium');
    const campaignParam = urlParams.get('utm_campaign');
    const termParam = urlParams.get('utm_term');
    const contentParam = urlParams.get('utm_content');

    if (sourceParam) {
      // Direct explicit campaign or referral link found
      const data: UtmData = {
        source: sourceParam.trim().toLowerCase(),
        medium: mediumParam ? mediumParam.trim().toLowerCase() : 'referral',
        campaign: campaignParam ? campaignParam.trim() : undefined,
        term: termParam ? termParam.trim() : undefined,
        content: contentParam ? contentParam.trim() : undefined,
        referrer: document.referrer || undefined,
        firstTouchDate: this.currentUtm?.firstTouchDate || new Date().toISOString(),
        landingPage: window.location.pathname,
      };
      this.saveUtm(data);
    } else if (!this.currentUtm && document.referrer) {
      // Infer source from referrer if no previous attribution exists
      const detected = this.detectSourceFromReferrer(document.referrer);
      if (detected) {
        const data: UtmData = {
          source: detected.source,
          medium: detected.medium,
          referrer: document.referrer,
          firstTouchDate: new Date().toISOString(),
          landingPage: window.location.pathname,
        };
        this.saveUtm(data);
      }
    } else if (!this.currentUtm) {
      // Default direct visit
      const data: UtmData = {
        source: 'direct',
        medium: 'none',
        firstTouchDate: new Date().toISOString(),
        landingPage: window.location.pathname,
      };
      this.saveUtm(data);
    }
  }

  private detectSourceFromReferrer(ref: string): { source: string; medium: string } | null {
    try {
      const hostname = new URL(ref).hostname.toLowerCase();
      if (hostname.includes('google')) return { source: 'google', medium: 'organic' };
      if (hostname.includes('facebook') || hostname.includes('fb.com')) return { source: 'facebook', medium: 'social' };
      if (hostname.includes('instagram')) return { source: 'instagram', medium: 'social' };
      if (hostname.includes('youtube')) return { source: 'youtube', medium: 'social' };
      if (hostname.includes('whatsapp') || hostname.includes('wa.me')) return { source: 'whatsapp', medium: 'chat' };
      if (hostname.includes('twitter') || hostname.includes('t.co') || hostname.includes('x.com')) return { source: 'twitter', medium: 'social' };
      if (hostname.includes('linkedin')) return { source: 'linkedin', medium: 'social' };
      return { source: hostname, medium: 'referral' };
    } catch {
      return null;
    }
  }

  private saveUtm(data: UtmData): void {
    this.currentUtm = data;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      sessionStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('UtmService: Failed to save to storage', e);
    }
  }

  getUtmData(): UtmData {
    if (this.currentUtm) return this.currentUtm;
    return {
      source: 'direct',
      medium: 'none',
      firstTouchDate: new Date().toISOString(),
      landingPage: typeof window !== 'undefined' ? window.location.pathname : '/',
    };
  }

  getWhatsAppTrackingSuffix(): string {
    const data = this.getUtmData();
    let text = `\n\n📌 Ref: [Source: ${data.source}`;
    if (data.campaign) text += ` | Campaign: ${data.campaign}`;
    if (data.medium && data.medium !== 'none') text += ` | Medium: ${data.medium}`;
    text += `]`;
    return text;
  }

  buildShareUrl(pathOrUrl: string, shareChannel: 'whatsapp' | 'facebook' | 'twitter' | 'share' | 'copy'): string {
    // ALWAYS force the live production domain (https://smincubators.in)
    // Even if called on localhost or passed window.location.href, we never share localhost!
    const liveOrigin = 'https://smincubators.in';
    let path = pathOrUrl;
    try {
      if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        const parsed = new URL(pathOrUrl);
        path = parsed.pathname + (parsed.search || '');
      }
    } catch {
      path = pathOrUrl;
    }

    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    const fullUrl = new URL(path, liveOrigin);
    fullUrl.searchParams.set('utm_source', shareChannel);
    fullUrl.searchParams.set('utm_medium', shareChannel === 'copy' ? 'link_copy' : 'social');
    fullUrl.searchParams.set('utm_campaign', 'product_share');

    return fullUrl.toString();
  }
}

