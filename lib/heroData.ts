export const PILE_LABELS = [
  'Corporate', 'Mobile', 'iOS', 'Android', 'B2B', 'B2C', 'Internal tooling', 'AI',
  'Higher education', 'Accessibility', 'Startup', 'Design system', 'Research',
  'Healthcare', 'E2E', 'Design', 'Testing', 'Web', 'Travel', '0 to 1',
];

export const PILE_EMOJIS = ['\u{1F33F}', '\u{1F989}', '\u{1F342}', '\u{1F9ED}', '\u{1F56F}️', '\u{1F426}', '\u{1F344}', '\u{1F50D}'];

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  linkedin: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'giuliana',
    name: 'Giuliana Canale',
    title: 'Human Experience Strategist @ Microsoft',
    quote:
      '“Haopeng was a key contributor to my Research and UX program, consistently turning complex, ambiguous challenges into clear, impactful outcomes. Her creativity, problem-solving, and collaborative spirit elevated our work and team dynamic. She exceeded expectations, brought fresh ideas, and delivered real value to both the team and end users. I highly recommend Haopeng to any team looking for a passionate and exceptional UX and research designer.”',
    linkedin: 'https://www.linkedin.com/in/giuliana-canale-50a3a3110/',
  },
  {
    id: 'catherine',
    name: 'Catherine Kim',
    title: 'Director of Design @ Expedia Group',
    quote:
      '“Haopeng was an invaluable asset to our team, contributing significantly to EG major project focused on shaping the future state of user experience and visual design across multiple brands within our product landscape. Haopeng’s meticulous attention to detail was truly impressive.”',
    linkedin: 'https://www.linkedin.com/in/ckimdesign/',
  },
  {
    id: 'liyao',
    name: 'Liyao Zhao',
    title: 'Head of Outreach @ Comm Lead, University of Washington',
    quote:
      '“Haopeng’s dedication to excellence and her ability to translate complex concepts into visually compelling designs have been instrumental in elevating Comm Lead program’s online presence to new heights.”',
    linkedin: 'https://www.linkedin.com/in/liyao-zhao-77282678/',
  },
  {
    id: 'alex',
    name: 'Alex Stonehill',
    title: 'Head of Creative Strategy @ Comm Lead, University of Washington',
    quote:
      '“Haopeng has a strong talent for design, and a great work ethic to go with it. Her work was incredibly impactful and if I had it to do again, I would have put even more trust in the quality and integrity of her work.”',
    linkedin: 'https://www.linkedin.com/in/alex-stonehill/',
  },
];

export interface ProjectCard {
  href: string;
  title: string;
  description: string;
  tags: string[];
}

export const PROJECT_CARDS: ProjectCard[] = [
  {
    href: '/work/microsoft-events-ai-assistant',
    title: 'Microsoft Events AI Assistant',
    description:
      'Addressed gap through quantitative and qualitative research. Revamped AI Assistant’s capability to better serve user’s goals, impacting 400k+ users’ digital experience every year.',
    tags: ['Research', 'Responsive Web', 'Progressive Web App'],
  },
  {
    href: '/work/journey-map-persona',
    title: 'Journey Map & Persona',
    description:
      'Visualized the end-to-end experience and persona to align cross-functional teams, prioritize efforts, guide strategic decisions, and inform smarter investments.',
    tags: ['Quantitative Research', 'Qualitative Research'],
  },
  {
    href: '/work/aws-katana',
    title: 'AWS Katana',
    description:
      'Researched problem space and enhanced an AWS internal data-building tool. Improved user experience to increase efficiency and decrease bounce rate.',
    tags: ['Data', 'Machine learning', 'Qualitative research'],
  },
  {
    href: '/work/foodo',
    title: 'Foodo APP',
    description:
      'Researched and designed a two-sided native mobile app for food donors and food banks to help people in need.',
    tags: ['0 to 1', 'Award winning', 'Usability testing'],
  },
  {
    href: '/work/artisan-design-system',
    title: 'Artisan Design System',
    description:
      'Designed and maintained the atomic design system using Figma to support EMR (electronic medical record) dashboard across web, tablet, and mobile.',
    tags: ['Auto layout', 'Components', 'Variants'],
  },
  {
    href: '/work/expedia-onedesk',
    title: 'Expedia OneDesk',
    description: 'Designed and delivered new all-in-one agent tool using Salesforce platform.',
    tags: ['Salesforce', 'MLP (minimal lovable product)', 'CRM (customer relationship management)'],
  },
];
