export interface MenuItem {
  name: string;
  category: 'Small Chops' | 'Pastries' | 'Party Platters';
  description: string;
  price: string;
}

export const SITE_CONFIG = {
  name: 'Darcy Chops',
  slogan: 'Finger foods you can trust',
  whatsappNumber: 'WHATSAPP_NUMBER',
  defaultMessage: "Hi Darcy Chops! I'd like to get my chops. Please share your menu and prices.",
  itemMessage: "Hi Darcy Chops! I'd like to order {item}.",
  city: '[CITY]',
  domain: 'https://[DOMAIN]',
  instagram: '[INSTAGRAM]',
  hours: 'Monday to Saturday, 9:00 AM to 8:00 PM',
  description:
    'Freshly made small chops, finger foods and party snacks for birthdays, weddings and every celebration. Message Darcy Chops on WhatsApp to order.',
} as const;

export const MENU_CATEGORIES = ['All', 'Small Chops', 'Pastries', 'Party Platters'] as const;

export const MENU_ITEMS: MenuItem[] = [
  {
    name: 'Puff-puff',
    category: 'Small Chops',
    description: 'Golden, fluffy bites made fresh for sharing.',
    price: 'Ask for today’s price',
  },
  {
    name: 'Spring rolls',
    category: 'Small Chops',
    description: 'Crisp pastry filled with a savoury mix.',
    price: 'Ask for today’s price',
  },
  {
    name: 'Samosa',
    category: 'Small Chops',
    description: 'Golden triangles with a tasty filling.',
    price: 'Ask for today’s price',
  },
  {
    name: 'Chicken wings',
    category: 'Small Chops',
    description: 'Juicy, well-seasoned party favourites.',
    price: 'Ask for today’s price',
  },
  {
    name: 'Meat pie',
    category: 'Pastries',
    description: 'A buttery, golden pastry with a hearty centre.',
    price: 'Ask for today’s price',
  },
  {
    name: 'Mini sausage rolls',
    category: 'Pastries',
    description: 'Flaky little rolls, ready for the snack table.',
    price: 'Ask for today’s price',
  },
  {
    name: 'Party platter',
    category: 'Party Platters',
    description: 'A crowd-ready mix of our small chops.',
    price: 'Made to your guest count',
  },
];

export const FAQS = [
  {
    question: 'What is the minimum order?',
    answer:
      'Minimum quantities depend on the items you choose. Message us on WhatsApp and we’ll help plan the right order.',
  },
  {
    question: 'Which areas do you deliver to?',
    answer: `We deliver around ${SITE_CONFIG.city}. Send us your location on WhatsApp and we’ll confirm availability and delivery cost.`,
  },
  {
    question: 'How far ahead should I order?',
    answer:
      'For the best availability, order at least 48 hours ahead. Larger party orders may need more notice.',
  },
  {
    question: 'How do I pay?',
    answer:
      'We’ll confirm the order total and payment details with you on WhatsApp before your order is prepared.',
  },
  {
    question: 'Can I customise my order?',
    answer:
      'Yes. Tell us your guest count, favourite items and any preferences, and we’ll put together a suitable mix.',
  },
] as const;
