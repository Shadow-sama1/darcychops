import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FAQS, SITE_CONFIG } from '../config/site.config';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(): void {
    const title = 'Darcy Chops | Finger Foods You Can Trust';
    const canonical = SITE_CONFIG.domain;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: SITE_CONFIG.description });
    this.meta.updateTag({ name: 'theme-color', content: '#111111' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: SITE_CONFIG.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_CONFIG.name });
    this.meta.updateTag({ property: 'og:image', content: `${canonical}/assets/social-card.png` });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: SITE_CONFIG.description });
    this.meta.updateTag({ name: 'twitter:image', content: `${canonical}/assets/social-card.png` });

    let canonicalLink = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.rel = 'canonical';
      this.document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FoodEstablishment',
          name: SITE_CONFIG.name,
          slogan: SITE_CONFIG.slogan,
          description: SITE_CONFIG.description,
          url: canonical,
          logo: `${canonical}/assets/logo.svg`,
          image: `${canonical}/assets/social-card.png`,
          telephone: `+${SITE_CONFIG.whatsappNumber}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: SITE_CONFIG.city,
          },
          areaServed: SITE_CONFIG.city,
          openingHours: 'Mo-Sa 09:00-20:00',
          sameAs: [SITE_CONFIG.instagram],
          priceRange: '₦₦',
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        },
      ],
    };

    let jsonLd = this.document.querySelector<HTMLScriptElement>('#site-structured-data');
    if (!jsonLd) {
      jsonLd = this.document.createElement('script');
      jsonLd.id = 'site-structured-data';
      jsonLd.type = 'application/ld+json';
      this.document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(structuredData);
  }
}
