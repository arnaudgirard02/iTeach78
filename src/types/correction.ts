export interface CorrectionCriterion {
  id: string;
  description: string;
  points: number;
}

export interface CorrectionCopy {
  id: string;
  name: string;
  content: string;
  contentChunks?: string[];
  correction?: string;
  createdAt: Date;
  archived: boolean;
}

export interface CorrectionProject {
  id?: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'in_progress' | 'completed';
  classe: string;
  sujet: string;
  totalPoints: number;
  criteria: CorrectionCriterion[];
  copies: CorrectionCopy[];
}