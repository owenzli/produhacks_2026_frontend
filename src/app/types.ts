export type WorkMode = 'remote' | 'hybrid' | 'in-office';
export type RoleTemplate = string;

export type TaskStatus = 'not-started' | 'in-progress' | 'completed';
export type Week = number;
export type ContactType = 'onboarding' | 'collaborator';

export interface CustomTemplateTask {
  title: string;
  category: string;
  week: Week;
  isTechnicalSetup: boolean;
}

export interface CustomTemplate {
  id: string;
  label: string;
  department: string;
  iconName: string;
  color: string;
  tasks: CustomTemplateTask[];
}

export interface ManagerProfile {
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  teamSize: string;
  commsTool: string;
  privateDocs: Array<{ title: string; url: string }>;
}

export interface HireInfo {
  name: string;
  roleTitle: string;
  department: string;
  startDate: string;
  workMode: WorkMode;
  template: RoleTemplate;
  onboardingDuration: number;
}

export interface Task {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  linkedDoc: string;
  status: TaskStatus;
  week: Week;
  docDebtResolved: boolean;
  docDebtNote: string;
  docDebtAssignee: string;
  isTechnicalSetup: boolean;
  completed: boolean;
  category: string;
}

export interface TeamContact {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  scheduleLink: string;
  responsibilities: string[];
  contactType: ContactType;
  avatarColor: string;
}

export interface HireRecord {
  id: string;
  info: HireInfo;
  tasks: Task[];
  roadmapGenerated: boolean;
  launched: boolean;
  contacts: TeamContact[];
}
