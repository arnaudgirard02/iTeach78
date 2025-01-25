export interface StudentProgress {
  correctionId: string;
  grade: number;
  date: Date;
}

export interface ClassAnalytics {
  id?: string;
  userId: string;
  classe: string;
  averageGrade: number;
  successRate: number;
  monthlyProgress: number;
  studentProgress: StudentProgress[];
  updatedAt: Date;
}