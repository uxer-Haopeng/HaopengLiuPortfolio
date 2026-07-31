export const HERO = {
  title: 'Microsoft Events\nAI Assistant',
  disclaimer:
    'Due to the NDA, I can only describe the high-level design process and the methodologies. But I’d love to share more details and prototypes in interviews!',
};

export const OVERVIEW = {
  challenge:
    'Attendees need more guidance to personalize event experience without much manual effort. But only 19% used the chatbot to assist them.',
  solution: 'Designed a dedicated AI Assistant offering proactive guidance beyond the chatbot.',
  role: 'Lead UX Designer & Researcher shaping the end-to-end AI Assistant',
  deliverables: [
    '156-response user survey and synthesis',
    'Impact-effort matrix to prioritize opportunities',
    'End-to-end design flows and prototypes',
    'Entry point and messaging revamp',
    '10 usability tests with iterative design refinements',
  ],
  team: ['2 Product Managers', '3 Engineers'],
  quickStats: [
    { value: '3×', label: 'Increase in AI Assistant engagement' },
    { value: '+36%', label: 'New connections made' },
    { value: '52%', label: 'Suggested sessions added' },
    { value: '9%', label: 'money saved' },
    { value: '+31%', label: 'Data captured' },
  ],
};

export const PROBLEM = {
  title: 'Data uncovered a low-value Chatbot that made us rethink the friction behind AI Assistant experience',
  body: 'Microsoft event websites are information-rich experiences. While an AI Assistant (a standard chatbot) is available, both quantitative and qualitative data consistently showed low adoption and even lower perceived value.',
  stats: [
    { value: '255k', label: '# of registered attendees' },
    { value: '50k', label: '# of chatbot users' },
    { value: '81k', label: '# of questions answered' },
    { value: '2.6k', label: 'Answers liked' },
    { value: '1.4k', label: 'Answers disliked' },
  ],
};

export const RESEARCH = {
  title: 'I uncovered deeper needs by utilizing 2 years of past research and 1 quick survey',
  body: 'Previous research showed our AI assistant fell short, yet attendees desired more intelligent, personalized guidance. Our next step was defining what a new AI Assistant needed to deliver and here’s how I did it:',
  cards: [
    {
      title: 'I conducted a 7-question survey to confirm assumptions made from past research and discover new insights.',
      body: 'To ensure our efforts were strategically aligned, I first engaged with key stakeholders to learn their curiosities, hypotheses, and the data they needed to see. I then created a short and open-ended survey to learn attendee needs and pain-points.',
      image: '/images/case-studies/ms-ai-assistant/research-card-1.png',
    },
    {
      title: 'I synthesized 1000+ verbatim into Impact-Effort Matrix, identifying key themes and emerging opportunities.',
      body: 'The survey had 156 responses, providing valuable data on attendee behaviors, expectations, and frustrations with the AI Assistant. I used Impact-Effort Matrix to prioritize potential AI Assistant features and Decision Log for implementation to ensure a feasible development.',
      image: '/images/case-studies/ms-ai-assistant/research-card-2.png',
    },
  ],
};

export const STRATEGY = {
  title: 'Research pushed us move beyond chatbot fixes to built a true AI Assistant for automated event experience',
  body: 'The research revealed that attendees needed more than a reactive chatbot. Therefore I changed my strategy to design a true AI Assistant capable of making the complex event experience seamless and intuitive.',
};

export const HMW = {
  kicker: 'so...',
  title: 'design AI-powered attendee experience that is personalized, assisted, and automated.',
};

export interface ComparisonCard {
  tag: string;
  title: string;
  body: string;
  image: string;
}

export interface Decision {
  label: string;
  title: string;
  pairs: { problem: ComparisonCard; solution: ComparisonCard }[];
}

export const DECISIONS: Decision[] = [
  {
    label: 'Design Decision No.1',
    title: 'Driving discoverability and increasing awareness',
    pairs: [
      {
        problem: {
          tag: 'Pain point 1: hidden in plain sight, failed to stand out',
          title: 'The AI Assistant’s main entry point is easy to miss',
          body: 'The AI Assistant’s main entry point “Customize your schedule” has low adoption. Only 19% of attendees used it, and over half said they didn’t even know it existed. Heat map confirmed AI Assistant is one of the least popular click on the home page.',
          image: '/images/case-studies/ms-ai-assistant/decision1-pair1-problem.png',
        },
        solution: {
          tag: 'Solution 1',
          title: 'Solution 1: design hierarchy to elevate the AI Assistant as a primary action',
          body: 'I made the entry point feel like a key part of the planning journey. Early usability tests showed increased click-throughs and reduced hesitation time to engage with the AI Assistant.',
          image: '/images/case-studies/ms-ai-assistant/decision1-pair1-solution.png',
        },
      },
      {
        problem: {
          tag: 'Pain point 2: unclear messaging so no reason to engage',
          title: 'The chatbot has no clear value proposition',
          body: 'The chatbot has no clear messaging about what it could do or how it would save time. The AI Assistant never earned their buy-in.',
          image: '/images/case-studies/ms-ai-assistant/decision1-pair2-problem.png',
        },
        solution: {
          tag: 'Solution 2',
          title: 'Solution 2: use persuasive prompts to give attendees a reason to care',
          body: 'The chatbot now surfaces relevant prompts to give attendees a clear starting point. This gave attendees a clear reason to engage and helped them see real value quickly.',
          image: '/images/case-studies/ms-ai-assistant/decision1-pair2-solution.png',
        },
      },
    ],
  },
  {
    label: 'Design Decision No.2',
    title: 'Simplifying the overwhelming pre-event planning',
    pairs: [
      {
        problem: {
          tag: 'Too many filter options leads to information overload',
          title: 'Building a schedule was time-consuming and cognitively demanding',
          body: 'Attendees had to browse pages of sessions and add them one-by-one to their schedule. Research confirmed this time-consuming and cognitively-demanding task hurt pre-event satisfaction.',
          image: '/images/case-studies/ms-ai-assistant/decision2-pair1-problem.png',
        },
        solution: {
          tag: 'Solution 1',
          title: 'Solution 1: automating planning to reduce friction',
          body: 'A full-page AI flow that generates a personalized schedule based on attendee profile. Attendees can review, swap, or add all sessions at once—turning a stressful process into a confident, guided experience.',
          image: '/images/case-studies/ms-ai-assistant/decision2-pair1-solution.png',
        },
      },
      {
        problem: {
          tag: 'Pain point 2: decision fatigue caused missed opportunities',
          title: 'Overlapping sessions made planning stressful',
          body: 'Overlapping sessions made planning stressful, and without AI support, resolving conflicts was error-prone. Attendees lacked confidence they picked the right sessions for their specific level, background, or needs.',
          image: '/images/case-studies/ms-ai-assistant/decision2-pair2-problem.png',
        },
        solution: {
          tag: 'Solution 2',
          title: 'Solution 2: smart conflict resolution that builds confidence',
          body: 'The AI Assistant now recommends the best-fit options with clearing reasoning based on input. Attendees feel confident in their choices and can build a strong schedule in minutes, not hours.',
          image: '/images/case-studies/ms-ai-assistant/decision2-pair2-solution.png',
        },
      },
    ],
  },
  {
    label: 'Design Decision No.3',
    title: 'Connecting attendees with the right people',
    pairs: [
      {
        problem: {
          tag: 'Pain point 1: no direction, no connection',
          title: 'Attendees don’t know who to talk to',
          body: 'Attendees don’t know who to talk to. The current directory provides surface-level info offers no meaningful way to identify relevant people, people are left guessing who’s worth reaching out to.',
          image: '/images/case-studies/ms-ai-assistant/decision3-pair1-problem.png',
        },
        solution: {
          tag: 'Solution 1',
          title: 'Solution 1: help attendees find “their people”',
          body: 'AI Assistant makes networking no longer a guesswork by surfacing relevant contacts based on shared sessions and background.',
          image: '/images/case-studies/ms-ai-assistant/decision3-pair1-solution.png',
        },
      },
      {
        problem: {
          tag: 'Pain point 2: the UI assumes everyone is an extrovert',
          title: 'Cold outreach creates a barrier for introverts',
          body: 'The current CTAs to connect require attendees to initiate cold outreach, which majority won’t do. This creates a barrier for introverts and first-timers, who want connection but need help breaking the ice.',
          image: '/images/case-studies/ms-ai-assistant/decision3-pair2-problem.png',
        },
        solution: {
          tag: 'Solution 2',
          title: 'Solution 2: facilitate low-pressure networking',
          body: 'Designed structured prompts, conversation starters, or shared group chats based on session attendance or topics of interest. Using real-time context to identify who’s actively open to networking.',
          image: '/images/case-studies/ms-ai-assistant/decision3-pair2-solution.png',
        },
      },
    ],
  },
];

export const REFLECTION = {
  title: 'The revamped AI Assistant empowers attendees and drives business outcomes',
  body: 'These 3 challenges capture the heart of my design process: navigating ambiguity, balancing trade-offs, and advocating for what’s best for users. Through research-driven design, cross-functional collaboration, and always thinking ahead, I designed systems that shifted behavior and delivered business value.',
};

export const USABILITY_STATS = {
  kicker: 'Usability testing results from 10 participants:',
  stats: [
    { value: '2×', label: 'Faster to find the entry point after visual and placement changes' },
    { value: '50%', label: 'Participants built a satisfying schedule in under 5 minutes' },
    { value: '60%', label: 'Reported the experience felt “less overwhelming,” and “more guided”' },
    { value: '70%', label: 'Said the AI Assistant met or exceeded expectation.' },
  ],
};

export const IMPACT_STATS = {
  attendees: [
    { value: '+36%', label: 'New connections made', caption: 'Boosting attendee engagement and ROI for sponsors/partners.' },
    { value: '52%', label: 'Suggested sessions added', caption: 'Streamlining planning and increasing session attendance.' },
  ],
  business: [
    { value: '9%', label: 'Money saved in ops', caption: 'Integrating seamlessly with existing systems to reduce errors' },
    { value: '+31%', label: 'Actionable data captured', caption: 'Fueling smarter event planning, marketing, and investment.' },
  ],
};
