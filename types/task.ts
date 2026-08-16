export interface Task {
  id: string;
  name: string;
  duration: number; // in minutes
  priority: 'high' | 'medium' | 'low';
  isAIEstimated?: boolean;
}
