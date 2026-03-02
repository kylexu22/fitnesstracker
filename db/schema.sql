create extension if not exists pgcrypto;

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  muscle_group text not null default '',
  equipment text not null default '',
  notes text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists split_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists split_template_exercises (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references split_templates(id) on delete cascade,
  exercise_id uuid not null references exercises(id) on delete restrict,
  order_index integer not null check (order_index > 0),
  default_sets integer,
  default_rep_min integer,
  default_rep_max integer,
  notes text not null default '',
  unique (template_id, order_index),
  unique (template_id, exercise_id)
);

create index if not exists idx_template_exercises_template
  on split_template_exercises(template_id, order_index);

create table if not exists workout_sessions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references split_templates(id) on delete set null,
  name_snapshot text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  status text not null default 'active' check (status in ('active', 'completed', 'abandoned'))
);

create table if not exists session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references workout_sessions(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete set null,
  exercise_name_snapshot text not null,
  order_index integer not null check (order_index > 0),
  unique (session_id, order_index)
);

create index if not exists idx_session_exercises_session
  on session_exercises(session_id, order_index);

create table if not exists set_logs (
  id uuid primary key default gen_random_uuid(),
  session_exercise_id uuid not null references session_exercises(id) on delete cascade,
  set_number integer not null check (set_number > 0),
  reps integer not null check (reps > 0),
  weight numeric(7, 2),
  rpe numeric(3, 1),
  notes text not null default '',
  logged_at timestamptz not null default now(),
  unique (session_exercise_id, set_number)
);

create index if not exists idx_set_logs_session_exercise
  on set_logs(session_exercise_id, set_number);

create index if not exists idx_workout_sessions_started
  on workout_sessions(started_at desc);
