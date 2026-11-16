import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly document = inject(DOCUMENT);

  scrollTo(sectionId: string, behavior: ScrollBehavior): void {
    this.document.getElementById(sectionId)?.scrollIntoView({
      behavior,
      block: 'start',
    });
  }

  observeSections(onActiveSection: (sectionId: string) => void): IntersectionObserver | undefined {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) onActiveSection(visible.target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.4] },
    );

    this.document.querySelectorAll<HTMLElement>('main section[id]').forEach((section) => {
      observer.observe(section);
    });
    return observer;
  }
}
