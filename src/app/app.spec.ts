import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the brand promise and ordering action', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('FINGER FOODS');
    expect(compiled.querySelector('.hero__actions a')?.textContent).toContain('Get my chops');
  });

  it('creates an item-specific, encoded WhatsApp message', () => {
    const app = TestBed.createComponent(App).componentInstance;

    expect(app.openWhatsApp(app.orderMessage('Spring rolls'))).toBe(
      'https://wa.me/WHATSAPP_NUMBER?text=Hi%20Darcy%20Chops!%20I%27d%20like%20to%20order%20Spring%20rolls.',
    );
  });

  it('filters menu items by the selected category', () => {
    const app = TestBed.createComponent(App).componentInstance;

    app.activeCategory.set('Pastries');

    expect(app.visibleMenuItems().map((item) => item.name)).toEqual([
      'Meat pie',
      'Mini sausage rolls',
    ]);
  });
});
