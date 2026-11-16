import { afterNextRender, Component, computed, HostListener, inject, signal } from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { SITE_CONFIG, FAQS, MENU_CATEGORIES, MENU_ITEMS } from './config/site.config';
import { SeoService } from './services/seo.service';
import { ScrollService } from './services/scroll.service';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  readonly site = SITE_CONFIG;
  readonly faqs = FAQS;
  readonly categories = MENU_CATEGORIES;
  readonly menuOpen = signal(false);
  readonly logoFailed = signal(false);
  readonly expandedFaq = signal<number | null>(null);
  readonly activeCategory = signal('All');
  readonly activeSection = signal('home');
  readonly currentYear = new Date().getFullYear();
  readonly visibleMenuItems = computed(() => {
    const category = this.activeCategory();
    return category === 'All'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === category);
  });

  private readonly document = inject(DOCUMENT);
  private readonly seo = inject(SeoService);
  private readonly scroll = inject(ScrollService);

  constructor() {
    this.seo.apply();
    afterNextRender(() => this.observeSections());
  }

  openWhatsApp(message: string = this.site.defaultMessage): string {
    const encodedMessage = encodeURIComponent(message).replace(/'/g, '%27');
    return `https://wa.me/${this.site.whatsappNumber}?text=${encodedMessage}`;
  }

  orderMessage(itemName: string): string {
    return this.site.itemMessage.replace('{item}', itemName);
  }

  toggleFaq(index: number): void {
    this.expandedFaq.update((current) => (current === index ? null : index));
  }

  navigateTo(event: Event, sectionId: string): void {
    event.preventDefault();
    this.closeMenu();
    this.scroll.scrollTo(sectionId, this.reducedMotion() ? 'auto' : 'smooth');
    this.document.defaultView?.history.replaceState(null, '', `#${sectionId}`);
  }

  goHome(event: Event): void {
    event.preventDefault();
    this.closeMenu();
    this.scroll.scrollTo('home', this.reducedMotion() ? 'auto' : 'smooth');
    this.document.defaultView?.history.replaceState(null, '', '/');
  }

  toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeMenu();
      return;
    }

    this.menuOpen.set(true);
    this.document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => this.document.getElementById('mobile-menu-close')?.focus());
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;

    this.menuOpen.set(false);
    this.document.body.style.overflow = '';
    requestAnimationFrame(() => this.document.getElementById('menu-toggle')?.focus());
  }

  onMenuKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusable = this.document.querySelectorAll<HTMLElement>(
      '#mobile-menu a[href], #mobile-menu button:not([disabled])',
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && this.document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && this.document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  onOverlayClick(event: MouseEvent): void {
    const target = event.target;
    if (
      !(target instanceof Element) ||
      !target.closest('#mobile-menu nav, #mobile-menu button, #mobile-menu a')
    ) {
      this.closeMenu();
    }
  }

  private observeSections(): void {
    this.scroll.observeSections((sectionId) => this.activeSection.set(sectionId));
  }

  private reducedMotion(): boolean {
    return (
      this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false
    );
  }
}
