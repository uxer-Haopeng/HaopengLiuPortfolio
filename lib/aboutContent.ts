export interface HowIWorkCard {
  tag: string;
  num: string;
  title: string;
  body: string;
  dark: boolean;
}

export const HOW_I_WORK_CARDS: HowIWorkCard[] = [
  {
    tag: 'Define the goal', num: '01',
    title: 'I walk backward from the goal.',
    body: "Before I sketch anything, I want to know what success looks like, for the user and for the business. Then I work backward from that point to find the most efficient path, rather than designing forward and hoping it eventually connects.",
    dark: false,
  },
  {
    tag: 'Find where to start', num: '02',
    title: 'I move toward the fog, not away from it.',
    body: "The undefined parts of a project, the flows nobody has mapped out yet, are usually where I start. That's where the real risk lives, and the earlier it surfaces, the cheaper it is to solve.",
    dark: false,
  },
  {
    tag: 'Plan the roadmap', num: '03',
    title: "I map before I build — but I don't map forever.",
    body: "Understanding the shape of a problem, its constraints, edge cases, and limitations, matters more to me than jumping straight into screens. Once that shape is clear, though, further planning has diminishing returns. I'd rather test a real prototype and learn from it than refine a plan that hasn't been challenged yet.",
    dark: true,
  },
  {
    tag: 'Understand the structure', num: '04',
    title: 'I treat walls as clues, not enemies.',
    body: "Technical limits, business requirements, and timelines aren't things to design around. They're what turn an unlimited set of options into a solvable problem. Before working around a constraint, I ask why it exists. Some are arbitrary and worth pushing back on. Others are essential to the system. Knowing the difference is part of the job.",
    dark: false,
  },
  {
    tag: 'Test and iterate', num: '05',
    title: "I don't trust the first path.",
    body: "The most obvious answer is often missing something: an edge case, a user behavior the happy path doesn't account for. So I pressure-test my own ideas early, looking for what will break before a user finds it for me.",
    dark: false,
  },
  {
    tag: 'Design with AI', num: '06',
    title: 'I use faster tools to walk more paths, not to skip the walking.',
    body: "AI-assisted prototyping lets me test several directions in the time it used to take to test one. It doesn't replace judgment. I still decide which direction is worth pursuing. It simply gets me to that decision faster.",
    dark: true,
  },
  {
    tag: 'Make sense of failure', num: '07',
    title: 'I treat dead ends as data, not failure.',
    body: "A concept that doesn't work isn't wasted effort. It narrows the problem and sharpens the next attempt. I'd rather rule out several weak ideas quickly than defend one mediocre idea for months.",
    dark: false,
  },
  {
    tag: 'Zoom out to patterns', num: '08',
    title: 'I look for the pattern, and leave a map behind.',
    body: "When I encounter the same issue more than once, it's rarely a coincidence. It usually points to something systemic worth fixing at the source. So I document as I go, through specs, rationale, and clear handoffs, so the same problem doesn't have to be solved twice.",
    dark: false,
  },
  {
    tag: 'Land on the user', num: '09',
    title: 'I design for the person walking through it, not for myself.',
    body: 'Solving the problem is my job. Living with an unsolved one shouldn’t be the user’s. Every decision, from defaults to copy to the friction I choose to remove, works toward one outcome: the final experience should feel obvious, even if getting there wasn’t.',
    dark: true,
  },
];

export interface AiProcessStep {
  num: string;
  title: string;
  body: string;
}

export const AI_PROCESS_STEPS: AiProcessStep[] = [
  { num: '1', title: 'Diverge', body: 'I prompt for a dozen framings and layouts at once, then throw most away. Volume kills the blank page.' },
  { num: '2', title: 'Interrogate', body: 'I pressure-test each direction against real research — asking the model to argue against its own suggestion.' },
  { num: '3', title: 'Prototype', body: 'Promising paths become clickable in hours, not weeks. I hand users something to break early.' },
  { num: '4', title: 'Decide', body: 'This part stays human. I weigh the trade-offs, own the call, and keep the receipts.' },
];

export interface ProofPoint {
  name: string;
  text: string;
}

export interface WorkTrack {
  emoji: string;
  shortName: string;
  kicker: string;
  title: string;
  desc: string[];
  bringLabel: string;
  bring: string[];
  proofLabel: string;
  proof: ProofPoint[];
  bestFit: string;
  pricing?: boolean;
}

export const WORK_TRACKS: WorkTrack[] = [
  {
    emoji: '\u{1F3E2}', shortName: 'Enterprise',
    kicker: 'Navigating complexity at scale', title: 'Enterprise Product Design',
    desc: [
      'Large organizations have no shortage of ideas — they need clarity on which paths are worth pursuing.',
      'I help enterprise teams align user needs, business goals, and technical realities to design scalable products that drive adoption.',
    ],
    bringLabel: 'What I bring',
    bring: [
      'User research and insight synthesis to uncover unmet needs',
      'Product strategy and prioritization to identify high-impact opportunities',
      'End-to-end UX design across complex workflows',
      'Cross-functional collaboration with PM, engineering, and leadership teams',
    ],
    proofLabel: 'Proof points',
    proof: [
      { name: 'Microsoft: ', text: 'Led research and product strategy for AI-powered event experiences serving 400K+ annual users, uncovering adoption barriers and shaping AI Assistant experiences that improved discoverability and personalization.' },
      { name: 'Microsoft: ', text: 'Analyzed 2.4M+ attendee records and synthesized user insights to influence product decisions and secure alignment across 7 cross-functional teams.' },
      { name: 'Expedia: ', text: 'Improved Virtual Agent experiences through LLM/NLU enhancements, contributing to a +2% self-service increase, $10K+ annualized efficiency savings, and $3.9M/year repeat booking impact.' },
    ],
    bestFit: 'Full-time senior UX/product design roles and embedded enterprise teams.',
  },
  {
    emoji: '\u{1F680}', shortName: 'Startup',
    kicker: 'Wearing multiple hats when the path is still being built', title: 'Startup Product Partner',
    desc: [
      'Early-stage products rarely come with a clear map. Teams need designers who can move between research, strategy, UX, UI, systems thinking, and execution.',
      'I help startups turn early ideas into products by identifying the right problems, building foundations, and moving quickly from uncertainty to validation.',
    ],
    bringLabel: 'What I bring',
    bring: [
      'Product discovery and opportunity definition',
      'MVP strategy and user experience design',
      'Design systems and scalable foundations',
      'Close partnership with founders, PMs, and engineers',
    ],
    proofLabel: 'Proof points',
    proof: [
      { name: 'Artisan: ', text: 'Designed across a two-sided healthcare platform, creating clinician workflows and patient experiences while building scalable UX foundations for a growing SaaS product.' },
      { name: 'Seminaut: ', text: 'Supported product design initiatives from concept exploration through execution, balancing user needs with business goals.' },
    ],
    bestFit: 'Startups looking for a flexible product partner who can own ambiguous challenges end-to-end.',
  },
  {
    emoji: '\u{1F9ED}', shortName: 'Fractional',
    kicker: "Need a designer, but not ready for a full-time hire?", title: 'Fractional Design Partner',
    desc: [
      "Some teams don't need another full-time employee. They need an experienced designer who can step in, unblock progress, and help navigate a specific challenge.",
      'Think of it as renting a senior UX partner by the chapter — not hiring one for the whole journey.',
    ],
    bringLabel: 'I can help with',
    bring: [
      'UX audits and product critiques',
      'AI product strategy and experience design',
      'User research and synthesis',
      'Feature design and workflow improvements',
      'Design systems and component strategy',
      'Design mentorship and team alignment',
    ],
    proofLabel: 'Ideal for',
    proof: [
      { name: '', text: 'Startups preparing for a product launch' },
      { name: '', text: 'Teams validating a new idea' },
      { name: '', text: 'Companies adding UX expertise temporarily' },
      { name: '', text: 'Founders who need a design partner to think through decisions' },
    ],
    bestFit: 'Teams that need consistent senior UX support without a full-time commitment.',
    pricing: true,
  },
];
