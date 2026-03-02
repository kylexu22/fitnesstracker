export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  notes?: string;
  archived?: boolean;
}

export interface TemplateExercise {
  exerciseId: string;
  defaultSets: number;
  repMin: number;
  repMax: number;
  notes?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  exercises: TemplateExercise[];
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  rpe?: number;
  notes?: string;
  timestamp: string;
}

export interface SessionExercise {
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface Session {
  id: string;
  name: string;
  templateId?: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed';
  exercises: SessionExercise[];
}
