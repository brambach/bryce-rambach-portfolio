export type Project = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
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
    'Open to Solutions Engineer or Full-Stack roles at early-stage startups. Relocating to SF or NYC summer 2026.',
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
      "The site you're on. Built as an Apple-style scrollable one-pager after an earlier conversational prototype didn't ship the message.",
    tags: ['React', 'Tailwind', 'Motion', 'TypeScript'],
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
