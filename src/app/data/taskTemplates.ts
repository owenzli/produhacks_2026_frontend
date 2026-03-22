import { WorkMode, RoleTemplate, TaskStatus, Week, ContactType, HireInfo, Task, TeamContact, HireRecord, CustomTemplate } from '../types';
// ─── Helpers ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).substring(2, 10);

const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr + 'T12:00:00');
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

function mkTask(
  overrides: Partial<Task> & { title: string; owner: string; dueDate: string; week: Week; category: string }
): Task {
  return {
    id: uid(),
    linkedDoc: '',
    status: 'not-started',
    docDebtResolved: false,
    docDebtNote: '',
    docDebtAssignee: '',
    isTechnicalSetup: false,
    completed: false,
    ...overrides,
  };
}

// ─── Task generators ─────────────────────────────────────────────────────────

// Common: tech setup for engineering roles
function getTechSetupTasks(startDate: string): Task[] {
  return [
    mkTask({ title: 'GitHub / GitLab repository access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://notion.so/acme/github-access-guide' }),
    mkTask({ title: 'Local development environment setup', owner: 'DevOps', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://notion.so/acme/dev-environment-setup' }),
    mkTask({ title: 'VPN access configuration', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://wiki.acme.com/vpn-setup' }),
    mkTask({ title: 'Credentials: Jira, Slack, cloud console', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://wiki.acme.com/new-hire-credentials' }),
    mkTask({ title: 'Architecture documentation review', owner: 'Tech Lead', dueDate: addDays(startDate, 2), week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://notion.so/acme/system-architecture' }),
    mkTask({ title: 'First PR / ticket assignment', owner: 'Tech Lead', dueDate: addDays(startDate, 4), week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://acme.atlassian.net/jira/good-first-issues' }),
  ];
}

// Common: basic IT for non-engineering roles
function getBasicITSetup(startDate: string): Task[] {
  return [
    mkTask({ title: 'Laptop & equipment setup', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://wiki.acme.com/it-equipment-checklist' }),
    mkTask({ title: 'Email, calendar & video conf setup', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://wiki.acme.com/comms-setup' }),
    mkTask({ title: 'Slack workspace & key channels', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/slack-channels-guide' }),
    mkTask({ title: 'Company intranet & wiki access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://wiki.acme.com' }),
  ];
}

// ── Engineering ───────────────────────────────────────────────────────────────
function generateFrontendTasks(startDate: string): Task[] {
  return [
    ...getTechSetupTasks(startDate),
    mkTask({ title: 'Welcome 1:1 with manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Team introductions', owner: 'Manager', dueDate: addDays(startDate, 1), week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/team-directory' }),
    mkTask({ title: 'Engineering handbook & code standards', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/engineering-handbook' }),
    mkTask({ title: 'Complete first good-first-issue ticket', owner: 'Tech Lead', dueDate: addDays(startDate, 10), week: 2, category: 'Engineering', linkedDoc: 'https://acme.atlassian.net/jira/good-first-issues' }),
    mkTask({ title: 'Frontend code standards & linting walkthrough', owner: 'Tech Lead', dueDate: addDays(startDate, 8), week: 2, category: 'Engineering', linkedDoc: 'https://notion.so/acme/frontend-code-standards' }),
    mkTask({ title: 'Design system & component library walkthrough', owner: 'Design Lead', dueDate: addDays(startDate, 9), week: 2, category: 'Design', linkedDoc: 'https://storybook.acme.com' }),
    mkTask({ title: 'CI/CD pipeline walkthrough', owner: 'DevOps', dueDate: addDays(startDate, 11), week: 2, category: 'Engineering', linkedDoc: 'https://notion.so/acme/cicd-overview' }),
    mkTask({ title: 'Submit first PR for code review', owner: 'Tech Lead', dueDate: addDays(startDate, 15), week: 3, category: 'Engineering', linkedDoc: 'https://notion.so/acme/pr-review-guide' }),
    mkTask({ title: 'Accessibility & performance standards review', owner: 'Tech Lead', dueDate: addDays(startDate, 16), week: 3, category: 'Engineering', linkedDoc: 'https://notion.so/acme/a11y-performance-standards' }),
    mkTask({ title: 'Testing standards & coverage goals review', owner: 'QA Lead', dueDate: addDays(startDate, 17), week: 3, category: 'Quality', linkedDoc: '' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Feature ownership assignment', owner: 'Manager', dueDate: addDays(startDate, 26), week: 4, category: 'Milestone', linkedDoc: '' }),
    mkTask({ title: 'Set 60/90-day goals', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/goals-template' }),
  ];
}

function generateBackendTasks(startDate: string): Task[] {
  return [
    ...getTechSetupTasks(startDate),
    mkTask({ title: 'Welcome 1:1 with manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Database schema & data model walkthrough', owner: 'Tech Lead', dueDate: addDays(startDate, 2), week: 1, category: 'Engineering', linkedDoc: 'https://notion.so/acme/database-schema-docs' }),
    mkTask({ title: 'API documentation & contract review', owner: 'Tech Lead', dueDate: addDays(startDate, 3), week: 1, category: 'Engineering', linkedDoc: 'https://api-docs.acme.com' }),
    mkTask({ title: 'First API endpoint implementation', owner: 'Tech Lead', dueDate: addDays(startDate, 10), week: 2, category: 'Engineering', linkedDoc: 'https://acme.atlassian.net/jira/good-first-issues' }),
    mkTask({ title: 'Backend code standards & conventions', owner: 'Tech Lead', dueDate: addDays(startDate, 8), week: 2, category: 'Engineering', linkedDoc: 'https://notion.so/acme/backend-standards' }),
    mkTask({ title: 'Security practices & OWASP overview', owner: 'Security Team', dueDate: addDays(startDate, 11), week: 2, category: 'Security', linkedDoc: 'https://notion.so/acme/security-guidelines' }),
    mkTask({ title: 'Database query optimization review', owner: 'Tech Lead', dueDate: addDays(startDate, 12), week: 2, category: 'Engineering', linkedDoc: 'https://notion.so/acme/query-optimization-guide' }),
    mkTask({ title: 'First production deployment (guided)', owner: 'DevOps', dueDate: addDays(startDate, 17), week: 3, category: 'Engineering', linkedDoc: 'https://notion.so/acme/deployment-runbook' }),
    mkTask({ title: 'Load testing & performance benchmarks', owner: 'Tech Lead', dueDate: addDays(startDate, 16), week: 3, category: 'Engineering', linkedDoc: '' }),
    mkTask({ title: '30-day retrospective with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Service ownership assignment', owner: 'Manager', dueDate: addDays(startDate, 26), week: 4, category: 'Milestone', linkedDoc: '' }),
    mkTask({ title: 'Set 60/90-day goals', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/goals-template' }),
  ];
}

function generateDevOpsTasks(startDate: string): Task[] {
  return [
    ...getTechSetupTasks(startDate),
    mkTask({ title: 'AWS / GCP / Azure console access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://notion.so/acme/cloud-console-access' }),
    mkTask({ title: 'Kubernetes cluster access & kubectl setup', owner: 'DevOps Lead', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://notion.so/acme/kubernetes-setup' }),
    mkTask({ title: 'Monitoring tools: Datadog / PagerDuty', owner: 'DevOps Lead', dueDate: addDays(startDate, 1), week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://app.datadoghq.com' }),
    mkTask({ title: 'Welcome 1:1 with manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Infrastructure & architecture overview', owner: 'DevOps Lead', dueDate: addDays(startDate, 2), week: 1, category: 'Engineering', linkedDoc: 'https://notion.so/acme/infrastructure-overview' }),
    mkTask({ title: 'On-call rotation onboarding', owner: 'DevOps Lead', dueDate: addDays(startDate, 8), week: 2, category: 'Operations', linkedDoc: 'https://notion.so/acme/on-call-handbook' }),
    mkTask({ title: 'Alert configuration & runbook review', owner: 'DevOps Lead', dueDate: addDays(startDate, 9), week: 2, category: 'Operations', linkedDoc: 'https://notion.so/acme/runbooks' }),
    mkTask({ title: 'Incident response process walkthrough', owner: 'DevOps Lead', dueDate: addDays(startDate, 10), week: 2, category: 'Operations', linkedDoc: 'https://notion.so/acme/incident-response' }),
    mkTask({ title: 'First infrastructure change (with review)', owner: 'DevOps Lead', dueDate: addDays(startDate, 15), week: 3, category: 'Engineering', linkedDoc: 'https://acme.atlassian.net/jira/infra-tickets' }),
    mkTask({ title: 'Disaster recovery & backup policy review', owner: 'DevOps Lead', dueDate: addDays(startDate, 16), week: 3, category: 'Security', linkedDoc: '' }),
    mkTask({ title: '30-day check-in', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Service ownership & on-call schedule', owner: 'Manager', dueDate: addDays(startDate, 26), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

function generateManagerTasks(startDate: string): Task[] {
  return [
    mkTask({ title: 'Hiring pipeline & ATS access', owner: 'HR', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://notion.so/acme/ats-guide' }),
    mkTask({ title: 'Jira / Linear admin access & board setup', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://acme.atlassian.net/jira' }),
    mkTask({ title: 'Confluence / Notion documentation access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Technical Setup', linkedDoc: 'https://notion.so/acme' }),
    mkTask({ title: 'Welcome 1:1 with director / VP', owner: 'Director', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: '1:1 with each direct report', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/team-directory' }),
    mkTask({ title: 'Company values & culture workshop', owner: 'HR', dueDate: addDays(startDate, 2), week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/culture-handbook' }),
    mkTask({ title: 'Product roadmap & Q-goals overview', owner: 'Director', dueDate: addDays(startDate, 3), week: 1, category: 'Strategy', linkedDoc: 'https://notion.so/acme/product-roadmap' }),
    mkTask({ title: 'First team standup facilitation', owner: 'Manager', dueDate: addDays(startDate, 8), week: 2, category: 'Leadership', linkedDoc: 'https://notion.so/acme/standup-format' }),
    mkTask({ title: 'Performance review process & rubrics', owner: 'HR', dueDate: addDays(startDate, 9), week: 2, category: 'People', linkedDoc: 'https://notion.so/acme/perf-review-rubrics' }),
    mkTask({ title: 'Team health & capacity review', owner: 'Manager', dueDate: addDays(startDate, 10), week: 2, category: 'People', linkedDoc: '' }),
    mkTask({ title: 'Sprint planning facilitation', owner: 'Manager', dueDate: addDays(startDate, 15), week: 3, category: 'Leadership', linkedDoc: 'https://notion.so/acme/sprint-planning-guide' }),
    mkTask({ title: 'Engineering strategy contribution', owner: 'Director', dueDate: addDays(startDate, 17), week: 3, category: 'Strategy', linkedDoc: '' }),
    mkTask({ title: '30-day review with director', owner: 'Director', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Team OKR setting for next quarter', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Strategy', linkedDoc: 'https://notion.so/acme/okr-template' }),
  ];
}

function generateFullStackTasks(startDate: string): Task[] {
  return [
    ...generateFrontendTasks(startDate),
    mkTask({ title: 'Database schema & data model overview', owner: 'Tech Lead', dueDate: addDays(startDate, 3), week: 1, category: 'Engineering', linkedDoc: 'https://notion.so/acme/database-schema-docs' }),
    mkTask({ title: 'API design & REST/GraphQL conventions', owner: 'Tech Lead', dueDate: addDays(startDate, 9), week: 2, category: 'Engineering', linkedDoc: 'https://api-docs.acme.com' }),
    mkTask({ title: 'End-to-end feature implementation (FE + BE)', owner: 'Tech Lead', dueDate: addDays(startDate, 16), week: 3, category: 'Engineering', linkedDoc: '' }),
  ];
}

// ── Product ───────────────────────────────────────────────────────────────────
function generateProductManagerTasks(startDate: string): Task[] {
  return [
    ...getBasicITSetup(startDate),
    mkTask({ title: 'Jira / Linear board setup & admin access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://acme.atlassian.net/jira' }),
    mkTask({ title: 'Confluence / Notion product wiki access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/product-wiki' }),
    mkTask({ title: 'Welcome 1:1 with VP of Product', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Meet cross-functional partners (Eng, Design, Data)', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/team-directory' }),
    mkTask({ title: 'Product vision & strategy deep dive', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Strategy', linkedDoc: 'https://notion.so/acme/product-vision' }),
    mkTask({ title: 'Current roadmap & OKR review', owner: 'Manager', dueDate: addDays(startDate, 4), week: 1, category: 'Strategy', linkedDoc: 'https://notion.so/acme/product-roadmap' }),
    mkTask({ title: 'User research repository walkthrough', owner: 'Manager', dueDate: addDays(startDate, 8), week: 2, category: 'Research', linkedDoc: 'https://dovetailapp.com/acme/research' }),
    mkTask({ title: 'Attend & shadow a sprint planning session', owner: 'Manager', dueDate: addDays(startDate, 9), week: 2, category: 'Process', linkedDoc: 'https://notion.so/acme/sprint-planning-guide' }),
    mkTask({ title: 'Customer feedback & support ticket review', owner: 'Manager', dueDate: addDays(startDate, 10), week: 2, category: 'Research', linkedDoc: 'https://notion.so/acme/customer-feedback-digest' }),
    mkTask({ title: 'Analytics & metrics dashboard walkthrough', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Analytics', linkedDoc: 'https://acme.looker.com/dashboards/product' }),
    mkTask({ title: 'Write first PRD or feature brief', owner: 'Manager', dueDate: addDays(startDate, 15), week: 3, category: 'Delivery', linkedDoc: 'https://notion.so/acme/prd-template' }),
    mkTask({ title: 'Facilitate first sprint planning', owner: 'Manager', dueDate: addDays(startDate, 17), week: 3, category: 'Process', linkedDoc: '' }),
    mkTask({ title: '30-day check-in with VP Product', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Own first feature end-to-end', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
    mkTask({ title: 'Set 60/90-day goals', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/goals-template' }),
  ];
}

function generateProductAnalystTasks(startDate: string): Task[] {
  return [
    ...getBasicITSetup(startDate),
    mkTask({ title: 'Analytics tools access (Amplitude / Mixpanel)', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/analytics-tools-access' }),
    mkTask({ title: 'Looker / Tableau / BI tool onboarding', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://acme.looker.com' }),
    mkTask({ title: 'Welcome 1:1 with manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Product metrics & KPI definitions review', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Analytics', linkedDoc: 'https://notion.so/acme/metrics-glossary' }),
    mkTask({ title: 'Data warehouse & SQL environment setup', owner: 'Manager', dueDate: addDays(startDate, 1), week: 1, category: 'Setup', linkedDoc: 'https://notion.so/acme/data-warehouse-access' }),
    mkTask({ title: 'Existing dashboard & report review', owner: 'Manager', dueDate: addDays(startDate, 4), week: 1, category: 'Analytics', linkedDoc: 'https://acme.looker.com/dashboards/overview' }),
    mkTask({ title: 'A/B testing framework & past experiment review', owner: 'Manager', dueDate: addDays(startDate, 8), week: 2, category: 'Analytics', linkedDoc: 'https://notion.so/acme/ab-testing-guide' }),
    mkTask({ title: 'First exploratory data analysis assignment', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'Present findings from first analysis', owner: 'Manager', dueDate: addDays(startDate, 16), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'Design first A/B test proposal', owner: 'Manager', dueDate: addDays(startDate, 18), week: 3, category: 'Delivery', linkedDoc: 'https://notion.so/acme/experiment-proposal-template' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Own a product metric / reporting area', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

// ── Design ────────────────────────────────────────────────────────────────────
function generateProductDesignerTasks(startDate: string): Task[] {
  return [
    ...getBasicITSetup(startDate),
    mkTask({ title: 'Figma org & team workspace access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://figma.com/acme-team' }),
    mkTask({ title: 'Design token & component library access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://storybook.acme.com' }),
    mkTask({ title: 'Welcome 1:1 with Design Manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Design system & brand guidelines walkthrough', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Design', linkedDoc: 'https://notion.so/acme/design-system-docs' }),
    mkTask({ title: 'Meet product & engineering partners', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/team-directory' }),
    mkTask({ title: 'User research repository & persona review', owner: 'Manager', dueDate: addDays(startDate, 4), week: 1, category: 'Research', linkedDoc: 'https://dovetailapp.com/acme/personas' }),
    mkTask({ title: 'Design critique process & cadence intro', owner: 'Manager', dueDate: addDays(startDate, 8), week: 2, category: 'Process', linkedDoc: 'https://notion.so/acme/design-critique-guide' }),
    mkTask({ title: 'UX audit of an existing product area', owner: 'Manager', dueDate: addDays(startDate, 10), week: 2, category: 'Design', linkedDoc: '' }),
    mkTask({ title: 'Shadow a user interview or usability session', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Research', linkedDoc: 'https://notion.so/acme/research-calendar' }),
    mkTask({ title: 'First wireframe / concept for assigned feature', owner: 'Manager', dueDate: addDays(startDate, 16), week: 3, category: 'Delivery', linkedDoc: 'https://figma.com/acme-team/first-project' }),
    mkTask({ title: 'Present designs in design critique', owner: 'Manager', dueDate: addDays(startDate, 18), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: '30-day check-in with Design Manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Own a feature area end-to-end', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
    mkTask({ title: 'Set 60/90-day design goals', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/goals-template' }),
  ];
}

function generateUXResearcherTasks(startDate: string): Task[] {
  return [
    ...getBasicITSetup(startDate),
    mkTask({ title: 'Research tools access (Dovetail / Maze / UserTesting)', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/research-tools-access' }),
    mkTask({ title: 'Welcome 1:1 with manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Existing research repository review', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Research', linkedDoc: 'https://dovetailapp.com/acme/research' }),
    mkTask({ title: 'User persona & journey map review', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Research', linkedDoc: 'https://dovetailapp.com/acme/personas' }),
    mkTask({ title: 'Meet product & design partners', owner: 'Manager', dueDate: addDays(startDate, 4), week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/team-directory' }),
    mkTask({ title: 'Research methodology & standards review', owner: 'Manager', dueDate: addDays(startDate, 8), week: 2, category: 'Process', linkedDoc: 'https://notion.so/acme/research-methodology' }),
    mkTask({ title: 'Shadow a user interview', owner: 'Manager', dueDate: addDays(startDate, 9), week: 2, category: 'Research', linkedDoc: 'https://notion.so/acme/research-calendar' }),
    mkTask({ title: 'User panel & recruitment process overview', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Process', linkedDoc: 'https://notion.so/acme/participant-recruitment' }),
    mkTask({ title: 'Design first research study plan', owner: 'Manager', dueDate: addDays(startDate, 15), week: 3, category: 'Delivery', linkedDoc: 'https://notion.so/acme/study-plan-template' }),
    mkTask({ title: 'Conduct first moderated session', owner: 'Manager', dueDate: addDays(startDate, 18), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Share first research synthesis with team', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

// ── Data ──────────────────────────────────────────────────────────────────────
function generateDataAnalystTasks(startDate: string): Task[] {
  return [
    ...getBasicITSetup(startDate),
    mkTask({ title: 'Data warehouse access (Snowflake / BigQuery)', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/data-warehouse-access' }),
    mkTask({ title: 'BI tool onboarding (Looker / Tableau / Mode)', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://acme.looker.com' }),
    mkTask({ title: 'dbt / SQL environment setup', owner: 'Manager', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/dbt-setup-guide' }),
    mkTask({ title: 'Welcome 1:1 with manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Data model & schema documentation review', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Data', linkedDoc: 'https://notion.so/acme/data-model-docs' }),
    mkTask({ title: 'Core business metrics & KPI definitions', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Data', linkedDoc: 'https://notion.so/acme/metrics-glossary' }),
    mkTask({ title: 'Existing dashboards & reports review', owner: 'Manager', dueDate: addDays(startDate, 4), week: 1, category: 'Data', linkedDoc: 'https://acme.looker.com/dashboards/overview' }),
    mkTask({ title: 'First exploratory SQL analysis task', owner: 'Manager', dueDate: addDays(startDate, 10), week: 2, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'Data quality standards & validation practices', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Data', linkedDoc: 'https://notion.so/acme/data-quality-standards' }),
    mkTask({ title: 'Build or extend a key dashboard', owner: 'Manager', dueDate: addDays(startDate, 16), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'Present analysis to stakeholders', owner: 'Manager', dueDate: addDays(startDate, 18), week: 3, category: 'Delivery', linkedDoc: 'https://notion.so/acme/analysis-presentation-template' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Own a metric or reporting domain', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

function generateDataScientistTasks(startDate: string): Task[] {
  return [
    ...getBasicITSetup(startDate),
    mkTask({ title: 'Python / Jupyter / notebook environment setup', owner: 'Manager', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/ml-environment-setup' }),
    mkTask({ title: 'Data warehouse & feature store access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/data-warehouse-access' }),
    mkTask({ title: 'ML platform & experiment tracking (MLflow)', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://mlflow.acme.com' }),
    mkTask({ title: 'Welcome 1:1 with manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Existing models & ML pipelines walkthrough', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'ML', linkedDoc: 'https://notion.so/acme/ml-model-registry' }),
    mkTask({ title: 'Data schema & feature definitions review', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Data', linkedDoc: 'https://notion.so/acme/feature-store-docs' }),
    mkTask({ title: 'Model deployment & monitoring process review', owner: 'Manager', dueDate: addDays(startDate, 9), week: 2, category: 'ML', linkedDoc: 'https://notion.so/acme/model-deployment-guide' }),
    mkTask({ title: 'First exploratory data analysis', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'First model experiment with existing dataset', owner: 'Manager', dueDate: addDays(startDate, 16), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'Model evaluation & results presentation', owner: 'Manager', dueDate: addDays(startDate, 18), week: 3, category: 'Delivery', linkedDoc: 'https://notion.so/acme/model-eval-template' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Own a model or ML problem area', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

function generateDataEngineerTasks(startDate: string): Task[] {
  return [
    ...getTechSetupTasks(startDate),
    mkTask({ title: 'Data warehouse access (Snowflake / BigQuery / Redshift)', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/data-warehouse-access' }),
    mkTask({ title: 'Orchestration tool setup (Airflow / Prefect)', owner: 'Manager', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/airflow-setup' }),
    mkTask({ title: 'dbt project setup & standards review', owner: 'Manager', dueDate: addDays(startDate, 1), week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/dbt-standards' }),
    mkTask({ title: 'Welcome 1:1 with manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Data architecture & pipeline overview', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Data', linkedDoc: 'https://notion.so/acme/data-architecture' }),
    mkTask({ title: 'Ingestion patterns & source systems review', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Data', linkedDoc: 'https://notion.so/acme/ingestion-patterns' }),
    mkTask({ title: 'Data quality & SLA standards review', owner: 'Manager', dueDate: addDays(startDate, 9), week: 2, category: 'Data', linkedDoc: 'https://notion.so/acme/data-quality-standards' }),
    mkTask({ title: 'First pipeline bug fix or enhancement', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Delivery', linkedDoc: 'https://acme.atlassian.net/jira/data-tickets' }),
    mkTask({ title: 'Build first new data model or pipeline', owner: 'Manager', dueDate: addDays(startDate, 16), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'Pipeline monitoring & alerting setup', owner: 'Manager', dueDate: addDays(startDate, 17), week: 3, category: 'Operations', linkedDoc: 'https://notion.so/acme/pipeline-monitoring' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Pipeline ownership assignment', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

// ── Platform / SRE ────────────────────────────────────────────────────────────
function generateSRETasks(startDate: string): Task[] {
  return [
    ...getTechSetupTasks(startDate),
    mkTask({ title: 'AWS / GCP / Azure console access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/cloud-console-access' }),
    mkTask({ title: 'Kubernetes & kubectl setup', owner: 'Manager', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/kubernetes-setup' }),
    mkTask({ title: 'Monitoring & alerting tools (Datadog / PagerDuty)', owner: 'Manager', dueDate: addDays(startDate, 1), week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://app.datadoghq.com' }),
    mkTask({ title: 'Welcome 1:1 with manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'SLA / SLO / SLI definitions & current state', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Reliability', linkedDoc: 'https://notion.so/acme/slo-definitions' }),
    mkTask({ title: 'Incident response runbook walkthrough', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Operations', linkedDoc: 'https://notion.so/acme/incident-response' }),
    mkTask({ title: 'On-call rotation onboarding', owner: 'Manager', dueDate: addDays(startDate, 8), week: 2, category: 'Operations', linkedDoc: 'https://notion.so/acme/on-call-handbook' }),
    mkTask({ title: 'Alert configuration & noise review', owner: 'Manager', dueDate: addDays(startDate, 9), week: 2, category: 'Reliability', linkedDoc: 'https://notion.so/acme/alert-standards' }),
    mkTask({ title: 'Capacity planning & scaling review', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Reliability', linkedDoc: 'https://notion.so/acme/capacity-planning' }),
    mkTask({ title: 'First infrastructure change (reviewed)', owner: 'Manager', dueDate: addDays(startDate, 15), week: 3, category: 'Delivery', linkedDoc: 'https://acme.atlassian.net/jira/infra-tickets' }),
    mkTask({ title: 'Error budget & reliability report contribution', owner: 'Manager', dueDate: addDays(startDate, 17), week: 3, category: 'Reliability', linkedDoc: '' }),
    mkTask({ title: 'Disaster recovery drill participation', owner: 'Manager', dueDate: addDays(startDate, 18), week: 3, category: 'Operations', linkedDoc: 'https://notion.so/acme/dr-runbook' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Service ownership assignment', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

// ── Security ──────────────────────────────────────────────────────────────────
function generateSecurityEngineerTasks(startDate: string): Task[] {
  return [
    ...getTechSetupTasks(startDate),
    mkTask({ title: 'SIEM & security tooling access (Splunk / CrowdStrike)', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/security-tools-access' }),
    mkTask({ title: 'Vulnerability scanner & pen-test tool access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/pentest-tools-setup' }),
    mkTask({ title: 'Welcome 1:1 with Security Manager', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Security policies & compliance framework review', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Security', linkedDoc: 'https://notion.so/acme/security-policies' }),
    mkTask({ title: 'Threat model & attack surface overview', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Security', linkedDoc: 'https://notion.so/acme/threat-model' }),
    mkTask({ title: 'Incident response process walkthrough', owner: 'Manager', dueDate: addDays(startDate, 8), week: 2, category: 'Operations', linkedDoc: 'https://notion.so/acme/security-incident-response' }),
    mkTask({ title: 'Access control & IAM policy review', owner: 'Manager', dueDate: addDays(startDate, 9), week: 2, category: 'Security', linkedDoc: 'https://notion.so/acme/iam-policies' }),
    mkTask({ title: 'First vulnerability assessment task', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'OWASP top-10 application review', owner: 'Manager', dueDate: addDays(startDate, 15), week: 3, category: 'Security', linkedDoc: 'https://owasp.org/Top10' }),
    mkTask({ title: 'Security audit contribution', owner: 'Manager', dueDate: addDays(startDate, 17), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Own a security domain or control area', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

// ── QA ────────────────────────────────────────────────────────────────────────
function generateQAEngineerTasks(startDate: string): Task[] {
  return [
    ...getBasicITSetup(startDate),
    mkTask({ title: 'Test management tool access (TestRail / Zephyr)', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/test-management-access' }),
    mkTask({ title: 'Bug tracker & Jira QA project access', owner: 'IT Team', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://acme.atlassian.net/jira/qa' }),
    mkTask({ title: 'Welcome 1:1 with QA Lead', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Test strategy & standards documentation review', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Quality', linkedDoc: 'https://notion.so/acme/qa-test-strategy' }),
    mkTask({ title: 'Product area familiarisation & demo', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/product-overview' }),
    mkTask({ title: 'Existing test plan & coverage review', owner: 'Manager', dueDate: addDays(startDate, 4), week: 1, category: 'Quality', linkedDoc: 'https://notion.so/acme/test-coverage-map' }),
    mkTask({ title: 'Release process & bug triage workflow', owner: 'Manager', dueDate: addDays(startDate, 8), week: 2, category: 'Process', linkedDoc: 'https://notion.so/acme/release-process' }),
    mkTask({ title: 'First exploratory testing session', owner: 'Manager', dueDate: addDays(startDate, 9), week: 2, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'Write test plan for assigned feature', owner: 'Manager', dueDate: addDays(startDate, 15), week: 3, category: 'Delivery', linkedDoc: 'https://notion.so/acme/test-plan-template' }),
    mkTask({ title: 'Execute regression suite & report results', owner: 'Manager', dueDate: addDays(startDate, 17), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Own test coverage for a product area', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

function generateSDETTasks(startDate: string): Task[] {
  return [
    ...getTechSetupTasks(startDate),
    mkTask({ title: 'Test automation framework access & setup', owner: 'Manager', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/automation-framework-guide' }),
    mkTask({ title: 'CI/CD pipeline & test stage walkthrough', owner: 'Manager', dueDate: startDate, week: 1, isTechnicalSetup: true, category: 'Setup', linkedDoc: 'https://notion.so/acme/cicd-test-stages' }),
    mkTask({ title: 'Welcome 1:1 with QA Lead', owner: 'Manager', dueDate: startDate, week: 1, category: 'Onboarding', linkedDoc: 'https://notion.so/acme/manager-11-template' }),
    mkTask({ title: 'Automation strategy & coverage goals review', owner: 'Manager', dueDate: addDays(startDate, 2), week: 1, category: 'Quality', linkedDoc: 'https://notion.so/acme/automation-strategy' }),
    mkTask({ title: 'Existing test suite review & contribution guide', owner: 'Manager', dueDate: addDays(startDate, 3), week: 1, category: 'Quality', linkedDoc: 'https://notion.so/acme/test-suite-contribution-guide' }),
    mkTask({ title: 'Framework patterns & naming conventions', owner: 'Manager', dueDate: addDays(startDate, 8), week: 2, category: 'Engineering', linkedDoc: 'https://notion.so/acme/automation-conventions' }),
    mkTask({ title: 'Fix a flaky or failing existing test', owner: 'Manager', dueDate: addDays(startDate, 10), week: 2, category: 'Delivery', linkedDoc: 'https://acme.atlassian.net/jira/flaky-tests' }),
    mkTask({ title: 'Performance / load testing tool overview', owner: 'Manager', dueDate: addDays(startDate, 11), week: 2, category: 'Quality', linkedDoc: 'https://notion.so/acme/load-testing-guide' }),
    mkTask({ title: 'Write first automated test for a new feature', owner: 'Manager', dueDate: addDays(startDate, 15), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: 'Integrate tests into CI pipeline', owner: 'Manager', dueDate: addDays(startDate, 17), week: 3, category: 'Delivery', linkedDoc: '' }),
    mkTask({ title: '30-day check-in with manager', owner: 'Manager', dueDate: addDays(startDate, 28), week: 4, category: 'Milestone', linkedDoc: 'https://notion.so/acme/30-day-checkin-template' }),
    mkTask({ title: 'Own automation coverage for a product area', owner: 'Manager', dueDate: addDays(startDate, 27), week: 4, category: 'Milestone', linkedDoc: '' }),
  ];
}

function getRawTasks(info: HireInfo, customTemplates: CustomTemplate[]): Task[] {
  switch (info.template) {
    case 'frontend': return generateFrontendTasks(info.startDate);
    case 'backend': return generateBackendTasks(info.startDate);
    case 'fullstack': return generateFullStackTasks(info.startDate);
    case 'devops': return generateDevOpsTasks(info.startDate);
    case 'engineering-manager': return generateManagerTasks(info.startDate);
    case 'product-manager': return generateProductManagerTasks(info.startDate);
    case 'product-analyst': return generateProductAnalystTasks(info.startDate);
    case 'product-designer': return generateProductDesignerTasks(info.startDate);
    case 'ux-researcher': return generateUXResearcherTasks(info.startDate);
    case 'data-analyst': return generateDataAnalystTasks(info.startDate);
    case 'data-scientist': return generateDataScientistTasks(info.startDate);
    case 'data-engineer': return generateDataEngineerTasks(info.startDate);
    case 'sre': return generateSRETasks(info.startDate);
    case 'security-engineer': return generateSecurityEngineerTasks(info.startDate);
    case 'qa-engineer': return generateQAEngineerTasks(info.startDate);
    case 'sdet': return generateSDETTasks(info.startDate);
    default:
      const custom = customTemplates.find(t => t.id === info.template);
      if (custom) {
        return custom.tasks.map(t => mkTask({
          title: t.title,
          owner: 'Manager',
          dueDate: t.week === 1 ? info.startDate : addDays(info.startDate, (t.week - 1) * 7),
          week: t.week,
          isTechnicalSetup: t.isTechnicalSetup,
          category: t.category,
        }));
      }
      return generateFrontendTasks(info.startDate);
  }
}

export function generateRoadmapTasks(info: HireInfo, customTemplates: CustomTemplate[] = []): Task[] {
  const tasks = getRawTasks(info, customTemplates);
  const duration = info.onboardingDuration || 2; 

  // Hardcoded templates are designed for 4 weeks. Squeeze or stretch to `duration`.
  const start = new Date(info.startDate + 'T12:00:00');
  
  return tasks.map(t => {
    if (t.week <= 1) return t;
    
    // Scale week map from [2, 4] to [2, duration]
    const originalW = Math.max(2, Math.min(4, t.week));
    const newWeek = Math.round(2 + (originalW - 2) * (duration - 2) / 2);
    
    const dDate = new Date(t.dueDate + 'T12:00:00');
    const offsetDays = Math.round((dDate.getTime() - start.getTime()) / (1000 * 3600 * 24));
    
    // Maintain day-of-week relative mapping
    const dayOfWeek = offsetDays % 7;
    const newOffset = (newWeek - 1) * 7 + dayOfWeek;
    
    return {
      ...t,
      week: newWeek,
      dueDate: addDays(info.startDate, newOffset),
    };
  });
}
