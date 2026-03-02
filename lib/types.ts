export type Exercise = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  notes: string;
  archived_at: Date | null;
  created_at: Date;
};

export type SplitTemplate = {
  id: string;
  name: string;
  description: string;
  created_at: Date;
};

export type SplitTemplateExercise = {
  id: string;
  template_id: string;
  exercise_id: string;
  order_index: number;
  default_sets: number | null;
  default_rep_min: number | null;
  default_rep_max: number | null;
  notes: string;
  exercise_name: string;
};

export type WorkoutSession = {
  id: string;
  template_id: string | null;
  name_snapshot: string;
  started_at: Date;
  ended_at: Date | null;
  status: "active" | "completed" | "abandoned";
};

export type SessionExercise = {
  id: string;
  session_id: string;
  exercise_id: string | null;
  exercise_name_snapshot: string;
  order_index: number;
};

export type SetLog = {
  id: string;
  session_exercise_id: string;
  set_number: number;
  reps: number;
  weight: string | null;
  rpe: string | null;
  notes: string;
  logged_at: Date;
};
