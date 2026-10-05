import { Models } from 'node-appwrite';
import { Project } from '../projects/types';

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_REVIEW = 'IN_REVIEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type Task = Models.Document & {
  name: string;
  workspaceId: string;
  status: TaskStatus;
  assigneeId: string;
  projectId: string;
  position: number;
  dueDate: string;
  description?: string;
  project?: Project;
  assignee?: {
    $id: string;
    name: string;
    email: string;
  };
};
