export type ArtifactKind =
  | 'role'
  | 'projects'
  | 'stack'
  | 'resume'
  | 'contact';

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
};

export type Topic = {
  id: ArtifactKind;
  label: string;
  prompt: string;
  keywords: string[];
  response: string;
  artifact: ArtifactKind;
};

export const BIO = {
  name: 'Bryce Rambach',
  email: 'bryce.rambach@gmail.com',
  phone: '(831) 236-1922',
  linkedin: 'https://linkedin.com/in/bryce-rambach',
  github: 'https://github.com/brambach',
  site: 'https://brycerambach.com',
  location: 'San Diego · Relocating summer 2026',
  availability:
    'Open to Solutions Engineer / Full-Stack roles at early-stage startups. Relocating to SF or NYC summer 2026.',
};

export const PROJECTS: Project[] = [
  {
    id: 'dd-portal',
    title: 'Digital Directions Client Portal',
    subtitle: 'Solo-built production app · 2025–Present',
    body:
      'Full-stack production application (Next.js 15, TypeScript, Drizzle ORM, Claude API, Freshdesk, Slack, Resend) monitoring 10+ live enterprise integrations in real time. Replaced scattered manual workflows and became the company-wide operations dashboard. Built at 20 with zero senior oversight.',
    tags: ['Next.js', 'TypeScript', 'Drizzle', 'Claude API', 'Postgres'],
  },
  {
    id: 'bryce-digital',
    title: 'Bryce Digital',
    subtitle: 'Independent development practice · 2025–Present',
    body:
      'Full-stack web applications and AI-powered tools for businesses. End-to-end delivery from client discovery through deployment, built with Claude Code and Next.js.',
    tags: ['Next.js', 'Claude Code', 'TypeScript', 'Client work'],
  },
  {
    id: 'dd-integrations',
    title: 'Enterprise Integration Work',
    subtitle: 'Digital Directions · March 2025 – Present',
    body:
      'Sole technical owner of 6+ concurrent production integrations connecting HR, payroll, and finance systems across HiBob, NetSuite, MYOB, KeyPay, and Deputy. Built reusable integration frameworks, webhook queueing systems with retry logic handling 500+ records per sync cycle, and health monitoring dashboards.',
    tags: ['HiBob', 'NetSuite', 'Workato', 'Node.js', 'Webhooks'],
  },
  {
    id: 'portfolio',
    title: 'brycerambach.com',
    subtitle: 'This site',
    body:
      "A conversation, not a portfolio. React-based chat where an animated avatar reacts to every word. Ask about the orb if you want to know how it works.",
    tags: ['React', 'Motion', 'Claude Haiku 4.5', 'Vercel Edge'],
  },
];

export const TOPICS: Topic[] = [
  {
    id: 'role',
    label: 'Work',
    prompt: 'Tell me about your work',
    // Phrase-based so "worked on" / "your workflow" don't false-match.
    // Brand names kept as singles because they're unambiguous signals
    // on a portfolio site.
    keywords: [
      'your work',
      'your job',
      'your role',
      'what do you do',
      'tell me about digital directions',
      'about your work',
      'your current role',
      'digital directions',
      'integration specialist',
    ],
    response:
      "I'm an Integration Specialist at Digital Directions — sole technical owner of 6+ concurrent production integrations across HiBob, NetSuite, MYOB, KeyPay, and Deputy. I build the plumbing between HR, payroll, and finance systems for mid-market companies.",
    artifact: 'role',
  },
  {
    id: 'projects',
    label: 'Projects',
    prompt: 'Show me your projects',
    keywords: [
      'your projects',
      'your project',
      'show me your projects',
      'show me a project',
      'show me your work',
      'what have you built',
      'what have you shipped',
      "what you've built",
      'something you built',
      "something you're proud",
    ],
    response:
      "Here are four I'm proud of — the Digital Directions client portal I shipped solo, my independent practice Bryce Digital, the integration work at DD, and this site itself.",
    artifact: 'projects',
  },
  {
    id: 'stack',
    label: 'AI & Tools',
    prompt: 'How do you use AI and tools?',
    keywords: [
      'your tools',
      'your stack',
      'how do you use ai',
      'ai and tools',
      'ai & tools',
      'your ai',
      'your workflow',
      'claude code',
      'claude api',
    ],
    response:
      "Claude Code is daily infrastructure — I use it to re-engineer how my team builds Workato recipes, ship solo apps faster, and standardize patterns across the integration fleet. Claude API is the backbone of the DD portal's intelligence layer.",
    artifact: 'stack',
  },
  {
    id: 'resume',
    label: 'Résumé',
    prompt: 'Give me the one-minute résumé',
    keywords: [
      'your resume',
      'your résumé',
      'your cv',
      'one-minute resume',
      'one-minute résumé',
      'one minute resume',
      'your background',
      'your experience',
      'download resume',
      'download your resume',
    ],
    response:
      "Here's the condensed version — CS at SDSU graduating May 2026, Integration Specialist at Digital Directions since March 2025, building production systems solo. Full PDF is one click away.",
    artifact: 'resume',
  },
  {
    id: 'contact',
    label: 'Contact',
    prompt: 'How can I reach you?',
    keywords: [
      'how can i reach',
      'how do i reach',
      'reach you',
      'contact you',
      'contact info',
      'your email',
      'your phone',
      'your linkedin',
      'your github',
      'hire you',
      'are you hiring',
      'hiring you',
    ],
    response:
      "Easiest is email, but everything's open — I'm actively looking for Solutions Engineer or Full-Stack roles at early-stage startups in SF or NYC, starting summer 2026.",
    artifact: 'contact',
  },
];

export const AI_STACK = [
  {
    name: 'Claude API',
    use: 'Intelligence layer in the DD client portal — summarization, error diagnosis, triage.',
  },
  {
    name: 'Claude Code',
    use: "Daily pair. Accelerates shipping and re-engineers my team's approach to integration work.",
  },
  {
    name: 'Workato',
    use: 'Orchestration layer for the enterprise integration fleet — with backend-driven recipes I wrote from scratch.',
  },
];

export const GREETING = {
  lineText: "Hi, I\u2019m Bryce.",
  accentWord: 'Bryce',
  subtitleLines: [
    'Full-stack engineer.',
    'Ships production solo.',
    'Uses Claude Code daily.',
  ],
  chips: ['Tell me about your work', 'Show me your projects', 'How do you use AI?'],
};

/** Follow-up chip suggestions shown after a scripted topic answer completes. */
export const FOLLOW_UPS: Record<ArtifactKind, string[]> = {
  role: [
    'Show me your projects',
    'How do you use AI?',
    'How can I reach you?',
  ],
  projects: [
    'Tell me more about the DD Client Portal',
    'How do you use AI and tools?',
    'How can I reach you?',
  ],
  stack: [
    'Show me your projects',
    'Tell me about your work',
    'How can I reach you?',
  ],
  resume: [
    'Show me your projects',
    'Tell me about your work',
    'How can I reach you?',
  ],
  contact: [
    'What are you looking for?',
    'Show me your projects',
    'Tell me about your work',
  ],
};

export const KEYWORDS_TO_HIGHLIGHT = [
  'NYC', 'New York', 'Manhattan', 'SF', 'San Francisco',
  'HiBob', 'NetSuite', 'MYOB', 'KeyPay', 'Deputy',
  'Workato', 'Digital Directions', 'Claude Code', 'Claude API',
  'Solutions Engineer', 'Integration Specialist',
  'integration', 'integrations', 'fintech', 'payroll', 'HRIS',
  'Bryce',
];
