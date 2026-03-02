import { Exercise, Template, Session } from './types';

export const mockExercises: Exercise[] = [
  { id: '1', name: 'Barbell Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { id: '2', name: 'Squat', muscleGroup: 'Legs', equipment: 'Barbell' },
  { id: '3', name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell' },
  { id: '4', name: 'Pull-ups', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { id: '5', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { id: '6', name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable' },
  { id: '7', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: '8', name: 'Bicep Curl', muscleGroup: 'Arms', equipment: 'Dumbbell' },
  { id: '9', name: 'Tricep Pushdown', muscleGroup: 'Arms', equipment: 'Cable' },
  { id: '10', name: 'Leg Curl', muscleGroup: 'Legs', equipment: 'Machine' },
];

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps workout',
    exercises: [
      { exerciseId: '1', defaultSets: 4, repMin: 8, repMax: 12 },
      { exerciseId: '5', defaultSets: 3, repMin: 10, repMax: 12 },
      { exerciseId: '9', defaultSets: 3, repMin: 12, repMax: 15 },
    ]
  },
  {
    id: '2',
    name: 'Pull Day',
    description: 'Back and biceps workout',
    exercises: [
      { exerciseId: '3', defaultSets: 4, repMin: 5, repMax: 8 },
      { exerciseId: '4', defaultSets: 3, repMin: 8, repMax: 12 },
      { exerciseId: '6', defaultSets: 3, repMin: 10, repMax: 12 },
      { exerciseId: '8', defaultSets: 3, repMin: 12, repMax: 15 },
    ]
  },
  {
    id: '3',
    name: 'Leg Day',
    description: 'Lower body focused workout',
    exercises: [
      { exerciseId: '2', defaultSets: 4, repMin: 8, repMax: 12 },
      { exerciseId: '7', defaultSets: 3, repMin: 12, repMax: 15 },
      { exerciseId: '10', defaultSets: 3, repMin: 12, repMax: 15 },
    ]
  },
];

export const mockSessions: Session[] = [
  {
    id: '1',
    name: 'Push Day',
    templateId: '1',
    startTime: '2026-03-02T09:00:00',
    endTime: '2026-03-02T10:30:00',
    status: 'completed',
    exercises: [
      {
        exerciseId: '1',
        sets: [
          { id: 's1', setNumber: 1, reps: 10, weight: 135, rpe: 7, timestamp: '2026-03-02T09:05:00' },
          { id: 's2', setNumber: 2, reps: 10, weight: 145, rpe: 8, timestamp: '2026-03-02T09:08:00' },
          { id: 's3', setNumber: 3, reps: 8, weight: 155, rpe: 9, timestamp: '2026-03-02T09:12:00' },
          { id: 's4', setNumber: 4, reps: 8, weight: 155, rpe: 9, timestamp: '2026-03-02T09:16:00' },
        ]
      },
      {
        exerciseId: '5',
        sets: [
          { id: 's5', setNumber: 1, reps: 12, weight: 50, rpe: 7, timestamp: '2026-03-02T09:20:00' },
          { id: 's6', setNumber: 2, reps: 10, weight: 55, rpe: 8, timestamp: '2026-03-02T09:24:00' },
          { id: 's7', setNumber: 3, reps: 10, weight: 55, rpe: 8, timestamp: '2026-03-02T09:28:00' },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Pull Day',
    templateId: '2',
    startTime: '2026-03-01T10:00:00',
    endTime: '2026-03-01T11:45:00',
    status: 'completed',
    exercises: [
      {
        exerciseId: '3',
        sets: [
          { id: 's8', setNumber: 1, reps: 5, weight: 225, rpe: 7, timestamp: '2026-03-01T10:05:00' },
          { id: 's9', setNumber: 2, reps: 5, weight: 245, rpe: 8, timestamp: '2026-03-01T10:10:00' },
          { id: 's10', setNumber: 3, reps: 5, weight: 265, rpe: 9, timestamp: '2026-03-01T10:15:00' },
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Leg Day',
    templateId: '3',
    startTime: '2026-02-28T14:00:00',
    endTime: '2026-02-28T15:30:00',
    status: 'completed',
    exercises: [
      {
        exerciseId: '2',
        sets: [
          { id: 's11', setNumber: 1, reps: 10, weight: 185, rpe: 7, timestamp: '2026-02-28T14:05:00' },
          { id: 's12', setNumber: 2, reps: 10, weight: 205, rpe: 8, timestamp: '2026-02-28T14:10:00' },
          { id: 's13', setNumber: 3, reps: 8, weight: 225, rpe: 9, timestamp: '2026-02-28T14:15:00' },
        ]
      }
    ]
  }
];
