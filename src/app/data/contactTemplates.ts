import { WorkMode, RoleTemplate, TaskStatus, Week, ContactType, HireInfo, Task, TeamContact, HireRecord } from '../types';
const uid = () => Math.random().toString(36).substring(2, 10);

// ─── Contact generators ───────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-rose-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-teal-600',
  'from-indigo-400 to-indigo-600',
  'from-pink-400 to-pink-600',
  'from-cyan-500 to-cyan-700',
  'from-lime-400 to-green-600',
  'from-fuchsia-400 to-fuchsia-600',
];

function mkContact(
  idx: number,
  contactType: ContactType,
  overrides: Omit<TeamContact, 'id' | 'contactType' | 'avatarColor'>
): TeamContact {
  return {
    id: uid(),
    contactType,
    avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
    ...overrides,
  };
}

export function generateDefaultContacts(template: RoleTemplate): TeamContact[] {
  const common: TeamContact[] = [
    mkContact(0, 'onboarding', { name: 'Jordan Marsh', role: 'IT Systems Admin', department: 'IT', email: 'jordan.marsh@company.com', scheduleLink: 'https://calendly.com/jordan-marsh', responsibilities: ['Laptop & equipment setup', 'Software licenses', 'VPN & credentials'] }),
    mkContact(1, 'onboarding', { name: 'Emma Wilson', role: 'People Operations', department: 'HR', email: 'emma.wilson@company.com', scheduleLink: 'https://calendly.com/emma-wilson', responsibilities: ['Benefits enrollment', 'Company policies', 'HR systems access'] }),
  ];

  if (template === 'frontend') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Priya Sharma', role: 'Tech Lead – Frontend', department: 'Engineering', email: 'priya.sharma@company.com', scheduleLink: 'https://calendly.com/priya-sharma', responsibilities: ['Codebase walkthrough', 'PR reviews', 'Good-first-issue triage'] }),
      mkContact(3, 'onboarding', { name: 'Carlos Torres', role: 'DevOps Engineer', department: 'Platform', email: 'carlos.torres@company.com', scheduleLink: 'https://calendly.com/carlos-torres', responsibilities: ['Dev environment setup', 'CI/CD access', 'Cloud credentials'] }),
      mkContact(4, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Feature requirements', 'Sprint priorities', 'Roadmap context'] }),
      mkContact(5, 'collaborator', { name: 'Lea Kim', role: 'Lead Product Designer', department: 'Design', email: 'lea.kim@company.com', scheduleLink: 'https://calendly.com/lea-kim', responsibilities: ['Design system', 'Figma handoffs', 'Component QA'] }),
      mkContact(6, 'collaborator', { name: 'David Park', role: 'QA Engineer', department: 'Quality', email: 'david.park@company.com', scheduleLink: 'https://calendly.com/david-park', responsibilities: ['Test coverage', 'Bug triage', 'Release sign-off'] }),
      mkContact(7, 'collaborator', { name: 'Aisha Patel', role: 'Backend Engineer', department: 'Engineering', email: 'aisha.patel@company.com', scheduleLink: 'https://calendly.com/aisha-patel', responsibilities: ['API contracts', 'Data schemas', 'Integration support'] }),
    ];
  }

  if (template === 'backend') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Marcus Reid', role: 'Tech Lead – Backend', department: 'Engineering', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['Service architecture', 'Code review', 'First ticket pairing'] }),
      mkContact(3, 'onboarding', { name: 'Nadia Osei', role: 'Security Engineer', department: 'Security', email: 'nadia.osei@company.com', scheduleLink: 'https://calendly.com/nadia-osei', responsibilities: ['Security access policies', 'Secrets management', 'OWASP review'] }),
      mkContact(4, 'onboarding', { name: 'Carlos Torres', role: 'DevOps Engineer', department: 'Platform', email: 'carlos.torres@company.com', scheduleLink: 'https://calendly.com/carlos-torres', responsibilities: ['Deployment pipeline', 'Production access', 'Monitoring setup'] }),
      mkContact(5, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Feature requirements', 'Sprint priorities', 'API acceptance criteria'] }),
      mkContact(6, 'collaborator', { name: 'Priya Sharma', role: 'Frontend Tech Lead', department: 'Engineering', email: 'priya.sharma@company.com', scheduleLink: 'https://calendly.com/priya-sharma', responsibilities: ['API consumer feedback', 'Contract alignment', 'Integration testing'] }),
      mkContact(7, 'collaborator', { name: 'Tyrese Banks', role: 'Data Engineer', department: 'Data', email: 'tyrese.banks@company.com', scheduleLink: 'https://calendly.com/tyrese-banks', responsibilities: ['Data pipeline contracts', 'Analytics events', 'Schema governance'] }),
    ];
  }

  if (template === 'fullstack') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Priya Sharma', role: 'Tech Lead – Frontend', department: 'Engineering', email: 'priya.sharma@company.com', scheduleLink: 'https://calendly.com/priya-sharma', responsibilities: ['Frontend codebase', 'Design system', 'Component patterns'] }),
      mkContact(3, 'onboarding', { name: 'Marcus Reid', role: 'Tech Lead – Backend', department: 'Engineering', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['Backend services', 'Database access', 'API review'] }),
      mkContact(4, 'onboarding', { name: 'Carlos Torres', role: 'DevOps Engineer', department: 'Platform', email: 'carlos.torres@company.com', scheduleLink: 'https://calendly.com/carlos-torres', responsibilities: ['Environment setup', 'CI/CD', 'Credentials'] }),
      mkContact(5, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Feature requirements', 'Sprint planning', 'Roadmap context'] }),
      mkContact(6, 'collaborator', { name: 'Lea Kim', role: 'Lead Product Designer', department: 'Design', email: 'lea.kim@company.com', scheduleLink: 'https://calendly.com/lea-kim', responsibilities: ['Figma handoffs', 'Design review', 'Component specs'] }),
      mkContact(7, 'collaborator', { name: 'David Park', role: 'QA Engineer', department: 'Quality', email: 'david.park@company.com', scheduleLink: 'https://calendly.com/david-park', responsibilities: ['E2E testing', 'Bug triage', 'Release approval'] }),
    ];
  }

  if (template === 'devops') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Ravi Nair', role: 'DevOps Lead / SRE', department: 'Platform', email: 'ravi.nair@company.com', scheduleLink: 'https://calendly.com/ravi-nair', responsibilities: ['Infrastructure overview', 'On-call onboarding', 'Runbook walkthroughs'] }),
      mkContact(3, 'onboarding', { name: 'Nadia Osei', role: 'Security Engineer', department: 'Security', email: 'nadia.osei@company.com', scheduleLink: 'https://calendly.com/nadia-osei', responsibilities: ['Cloud IAM policies', 'Secrets management', 'Compliance access'] }),
      mkContact(4, 'collaborator', { name: 'Marcus Reid', role: 'Backend Tech Lead', department: 'Engineering', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['Deployment requirements', 'Service SLAs', 'Capacity planning'] }),
      mkContact(5, 'collaborator', { name: 'Tyrese Banks', role: 'Data Engineer', department: 'Data', email: 'tyrese.banks@company.com', scheduleLink: 'https://calendly.com/tyrese-banks', responsibilities: ['Data pipeline infra', 'Airflow / Spark setup', 'Storage provisioning'] }),
      mkContact(6, 'collaborator', { name: 'Priya Sharma', role: 'Frontend Tech Lead', department: 'Engineering', email: 'priya.sharma@company.com', scheduleLink: 'https://calendly.com/priya-sharma', responsibilities: ['CDN & edge config', 'Build pipeline', 'Asset delivery'] }),
    ];
  }

  if (template === 'engineering-manager') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Grace Okonkwo', role: 'VP of Engineering', department: 'Engineering', email: 'grace.okonkwo@company.com', scheduleLink: 'https://calendly.com/grace-okonkwo', responsibilities: ['Org structure overview', 'Engineering strategy', 'Leadership expectations'] }),
      mkContact(3, 'onboarding', { name: 'Derek Liu', role: 'Finance Business Partner', department: 'Finance', email: 'derek.liu@company.com', scheduleLink: 'https://calendly.com/derek-liu', responsibilities: ['Headcount budget', 'Contractor approvals', 'Spend policies'] }),
      mkContact(4, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Roadmap alignment', 'Sprint planning', 'OKR setting'] }),
      mkContact(5, 'collaborator', { name: 'Lea Kim', role: 'Lead Product Designer', department: 'Design', email: 'lea.kim@company.com', scheduleLink: 'https://calendly.com/lea-kim', responsibilities: ['Design–eng collaboration', 'Design review process', 'Resourcing'] }),
      mkContact(6, 'collaborator', { name: 'Ravi Nair', role: 'DevOps Lead / SRE', department: 'Platform', email: 'ravi.nair@company.com', scheduleLink: 'https://calendly.com/ravi-nair', responsibilities: ['Platform reliability', 'On-call processes', 'Incident response'] }),
      mkContact(7, 'collaborator', { name: 'Tyrese Banks', role: 'Data Engineer', department: 'Data', email: 'tyrese.banks@company.com', scheduleLink: 'https://calendly.com/tyrese-banks', responsibilities: ['Metrics & dashboards', 'Team analytics', 'Data contracts'] }),
    ];
  }

  if (template === 'product-manager') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Claire Nguyen', role: 'VP of Product', department: 'Product', email: 'claire.nguyen@company.com', scheduleLink: 'https://calendly.com/claire-nguyen', responsibilities: ['Product vision & strategy', 'Roadmap alignment', 'OKR setting'] }),
      mkContact(3, 'onboarding', { name: 'Samantha Chen', role: 'Senior Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Process onboarding', 'Ritual introductions', 'First PRD review'] }),
      mkContact(4, 'collaborator', { name: 'Priya Sharma', role: 'Frontend Tech Lead', department: 'Engineering', email: 'priya.sharma@company.com', scheduleLink: 'https://calendly.com/priya-sharma', responsibilities: ['Sprint planning partner', 'Tech feasibility', 'Delivery estimates'] }),
      mkContact(5, 'collaborator', { name: 'Lea Kim', role: 'Lead Product Designer', department: 'Design', email: 'lea.kim@company.com', scheduleLink: 'https://calendly.com/lea-kim', responsibilities: ['Design handoffs', 'User flows', 'Prototype reviews'] }),
      mkContact(6, 'collaborator', { name: 'Tyrese Banks', role: 'Data Analyst', department: 'Data', email: 'tyrese.banks@company.com', scheduleLink: 'https://calendly.com/tyrese-banks', responsibilities: ['Metrics definitions', 'Dashboard setup', 'Experiment analysis'] }),
    ];
  }

  if (template === 'product-analyst') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Claire Nguyen', role: 'VP of Product', department: 'Product', email: 'claire.nguyen@company.com', scheduleLink: 'https://calendly.com/claire-nguyen', responsibilities: ['Analytics priorities', 'Metrics strategy', 'Stakeholder context'] }),
      mkContact(3, 'onboarding', { name: 'Tyrese Banks', role: 'Senior Data Analyst', department: 'Data', email: 'tyrese.banks@company.com', scheduleLink: 'https://calendly.com/tyrese-banks', responsibilities: ['SQL & BI onboarding', 'Metric definitions', 'Dashboard walkthroughs'] }),
      mkContact(4, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Experiment design', 'Feature analytics', 'Success metrics'] }),
      mkContact(5, 'collaborator', { name: 'Marcus Reid', role: 'Data Engineer', department: 'Data', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['Data pipeline access', 'Schema guidance', 'Data quality'] }),
    ];
  }

  if (template === 'product-designer') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Lea Kim', role: 'Head of Design', department: 'Design', email: 'lea.kim@company.com', scheduleLink: 'https://calendly.com/lea-kim', responsibilities: ['Design system overview', 'Critique facilitation', 'Career path guidance'] }),
      mkContact(3, 'onboarding', { name: 'Maya Russo', role: 'Senior Product Designer', department: 'Design', email: 'maya.russo@company.com', scheduleLink: 'https://calendly.com/maya-russo', responsibilities: ['Figma org walkthrough', 'First project pairing', 'Component library guide'] }),
      mkContact(4, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Feature requirements', 'User stories', 'Acceptance criteria'] }),
      mkContact(5, 'collaborator', { name: 'Priya Sharma', role: 'Frontend Tech Lead', department: 'Engineering', email: 'priya.sharma@company.com', scheduleLink: 'https://calendly.com/priya-sharma', responsibilities: ['Component feasibility', 'Handoff review', 'Accessibility guidance'] }),
      mkContact(6, 'collaborator', { name: 'Fiona Park', role: 'UX Researcher', department: 'Design', email: 'fiona.park@company.com', scheduleLink: 'https://calendly.com/fiona-park', responsibilities: ['Research insights', 'User interviews', 'Usability findings'] }),
    ];
  }

  if (template === 'ux-researcher') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Lea Kim', role: 'Head of Design', department: 'Design', email: 'lea.kim@company.com', scheduleLink: 'https://calendly.com/lea-kim', responsibilities: ['Research strategy', 'Team rituals', 'Repository access'] }),
      mkContact(3, 'onboarding', { name: 'Fiona Park', role: 'Senior UX Researcher', department: 'Design', email: 'fiona.park@company.com', scheduleLink: 'https://calendly.com/fiona-park', responsibilities: ['Research tool onboarding', 'User panel access', 'Study process guidance'] }),
      mkContact(4, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Research priorities', 'Feature questions', 'Insight application'] }),
      mkContact(5, 'collaborator', { name: 'Maya Russo', role: 'Product Designer', department: 'Design', email: 'maya.russo@company.com', scheduleLink: 'https://calendly.com/maya-russo', responsibilities: ['Design collaboration', 'Usability study design', 'Finding integration'] }),
    ];
  }

  if (template === 'data-analyst') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Tyrese Banks', role: 'Head of Analytics', department: 'Data', email: 'tyrese.banks@company.com', scheduleLink: 'https://calendly.com/tyrese-banks', responsibilities: ['Analytics strategy', 'Tool onboarding', 'Metric definitions'] }),
      mkContact(3, 'onboarding', { name: 'Marcus Reid', role: 'Data Engineer', department: 'Data', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['Data warehouse access', 'Schema walkthroughs', 'Pipeline context'] }),
      mkContact(4, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Analysis requests', 'Experiment design', 'Success metrics'] }),
      mkContact(5, 'collaborator', { name: 'Priya Sharma', role: 'Frontend Tech Lead', department: 'Engineering', email: 'priya.sharma@company.com', scheduleLink: 'https://calendly.com/priya-sharma', responsibilities: ['Event tracking', 'Analytics integration', 'Data layer context'] }),
    ];
  }

  if (template === 'data-scientist') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Tyrese Banks', role: 'Head of Data Science', department: 'Data', email: 'tyrese.banks@company.com', scheduleLink: 'https://calendly.com/tyrese-banks', responsibilities: ['ML strategy', 'Model review process', 'Research priorities'] }),
      mkContact(3, 'onboarding', { name: 'Marcus Reid', role: 'Data Engineer', department: 'Data', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['Feature store access', 'Pipeline walkthroughs', 'Data quality context'] }),
      mkContact(4, 'collaborator', { name: 'Carlos Torres', role: 'ML Platform Engineer', department: 'Platform', email: 'carlos.torres@company.com', scheduleLink: 'https://calendly.com/carlos-torres', responsibilities: ['ML infra setup', 'Model serving', 'Experiment tracking'] }),
      mkContact(5, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Use-case definition', 'Model success criteria', 'Roadmap context'] }),
    ];
  }

  if (template === 'data-engineer') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Marcus Reid', role: 'Data Engineering Lead', department: 'Data', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['Pipeline architecture', 'Tool onboarding', 'First ticket pairing'] }),
      mkContact(3, 'onboarding', { name: 'Carlos Torres', role: 'Platform / DevOps Engineer', department: 'Platform', email: 'carlos.torres@company.com', scheduleLink: 'https://calendly.com/carlos-torres', responsibilities: ['Infrastructure access', 'CI/CD setup', 'Cloud credentials'] }),
      mkContact(4, 'collaborator', { name: 'Tyrese Banks', role: 'Data Analyst', department: 'Data', email: 'tyrese.banks@company.com', scheduleLink: 'https://calendly.com/tyrese-banks', responsibilities: ['Consumer requirements', 'Schema feedback', 'Analytics needs'] }),
      mkContact(5, 'collaborator', { name: 'Nadia Osei', role: 'Security Engineer', department: 'Security', email: 'nadia.osei@company.com', scheduleLink: 'https://calendly.com/nadia-osei', responsibilities: ['Data access policies', 'PII handling standards', 'Compliance review'] }),
    ];
  }

  if (template === 'sre') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Ravi Nair', role: 'SRE / Platform Lead', department: 'Platform', email: 'ravi.nair@company.com', scheduleLink: 'https://calendly.com/ravi-nair', responsibilities: ['Infrastructure overview', 'On-call onboarding', 'SLO definitions'] }),
      mkContact(3, 'onboarding', { name: 'Nadia Osei', role: 'Security Engineer', department: 'Security', email: 'nadia.osei@company.com', scheduleLink: 'https://calendly.com/nadia-osei', responsibilities: ['Cloud IAM policies', 'Secrets management', 'Access controls'] }),
      mkContact(4, 'collaborator', { name: 'Marcus Reid', role: 'Backend Tech Lead', department: 'Engineering', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['Service SLAs', 'Deployment requirements', 'Incident escalation'] }),
      mkContact(5, 'collaborator', { name: 'Carlos Torres', role: 'DevOps Engineer', department: 'Platform', email: 'carlos.torres@company.com', scheduleLink: 'https://calendly.com/carlos-torres', responsibilities: ['CI/CD pipelines', 'Build tooling', 'Release processes'] }),
    ];
  }

  if (template === 'security-engineer') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'Nadia Osei', role: 'Head of Security', department: 'Security', email: 'nadia.osei@company.com', scheduleLink: 'https://calendly.com/nadia-osei', responsibilities: ['Security strategy', 'Tool onboarding', 'Threat model walkthrough'] }),
      mkContact(3, 'onboarding', { name: 'Ravi Nair', role: 'SRE / Platform Lead', department: 'Platform', email: 'ravi.nair@company.com', scheduleLink: 'https://calendly.com/ravi-nair', responsibilities: ['Cloud infrastructure', 'IAM & access', 'Compliance tooling'] }),
      mkContact(4, 'collaborator', { name: 'Marcus Reid', role: 'Backend Tech Lead', department: 'Engineering', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['Application security reviews', 'Secrets handling', 'Secure coding practices'] }),
      mkContact(5, 'collaborator', { name: 'Grace Okonkwo', role: 'VP of Engineering', department: 'Engineering', email: 'grace.okonkwo@company.com', scheduleLink: 'https://calendly.com/grace-okonkwo', responsibilities: ['Security policy sign-off', 'Risk escalation', 'Audit support'] }),
    ];
  }

  if (template === 'qa-engineer') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'David Park', role: 'QA Lead', department: 'Quality', email: 'david.park@company.com', scheduleLink: 'https://calendly.com/david-park', responsibilities: ['Test strategy', 'Tool onboarding', 'Release sign-off process'] }),
      mkContact(3, 'collaborator', { name: 'Samantha Chen', role: 'Product Manager', department: 'Product', email: 'sam.chen@company.com', scheduleLink: 'https://calendly.com/sam-chen', responsibilities: ['Acceptance criteria', 'Feature walkthroughs', 'Bug priority decisions'] }),
      mkContact(4, 'collaborator', { name: 'Priya Sharma', role: 'Frontend Tech Lead', department: 'Engineering', email: 'priya.sharma@company.com', scheduleLink: 'https://calendly.com/priya-sharma', responsibilities: ['Bug reproduction', 'Fix verification', 'Environment access'] }),
      mkContact(5, 'collaborator', { name: 'Marcus Reid', role: 'Backend Tech Lead', department: 'Engineering', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['API testing context', 'Backend bug triage', 'Test data setup'] }),
    ];
  }

  if (template === 'sdet') {
    return [
      ...common,
      mkContact(2, 'onboarding', { name: 'David Park', role: 'QA Lead / SDET Manager', department: 'Quality', email: 'david.park@company.com', scheduleLink: 'https://calendly.com/david-park', responsibilities: ['Automation strategy', 'Framework onboarding', 'CI integration review'] }),
      mkContact(3, 'onboarding', { name: 'Carlos Torres', role: 'DevOps Engineer', department: 'Platform', email: 'carlos.torres@company.com', scheduleLink: 'https://calendly.com/carlos-torres', responsibilities: ['CI/CD pipeline access', 'Test stage setup', 'Environment provisioning'] }),
      mkContact(4, 'collaborator', { name: 'Priya Sharma', role: 'Frontend Tech Lead', department: 'Engineering', email: 'priya.sharma@company.com', scheduleLink: 'https://calendly.com/priya-sharma', responsibilities: ['Component testability', 'Test selectors', 'Coverage gaps'] }),
      mkContact(5, 'collaborator', { name: 'Marcus Reid', role: 'Backend Tech Lead', department: 'Engineering', email: 'marcus.reid@company.com', scheduleLink: 'https://calendly.com/marcus-reid', responsibilities: ['API test contracts', 'Integration test setup', 'Backend coverage'] }),
    ];
  }

  return common;
}
