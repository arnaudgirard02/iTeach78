export interface Course {
  id?: string;
  userId: string;
  title: string;
  description: string;
  classe: string;
  duration: string;
  objectives: string[];
  content: string;
  resources: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
}