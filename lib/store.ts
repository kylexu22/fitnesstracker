import { z } from "zod";

import { sql } from "@/lib/db";
import type {
  Exercise,
  SessionExercise,
  SetLog,
  SplitTemplate,
  SplitTemplateExercise,
  WorkoutSession,
} from "@/lib/types";

const exerciseInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  muscleGroup: z.string().trim().max(80).default(""),
  equipment: z.string().trim().max(80).default(""),
  notes: z.string().trim().max(500).default(""),
});

const templateInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(""),
});

const templateExerciseInputSchema = z.object({
  templateId: z.string().uuid(),
  exerciseId: z.string().uuid(),
  defaultSets: z.coerce.number().int().positive().max(20).nullable().optional(),
  defaultRepMin: z.coerce.number().int().positive().max(100).nullable().optional(),
  defaultRepMax: z.coerce.number().int().positive().max(100).nullable().optional(),
  notes: z.string().trim().max(400).default(""),
});

const addSetInputSchema = z.object({
  sessionExerciseId: z.string().uuid(),
  reps: z.coerce.number().int().positive().max(200),
  weight: z.coerce.number().min(0).max(2000).nullable().optional(),
  rpe: z.coerce.number().min(1).max(10).nullable().optional(),
  notes: z.string().trim().max(300).default(""),
});

export type TemplateSummary = SplitTemplate & {
  exercise_count: number;
};

export type SessionWithExercises = {
  session: WorkoutSession;
  exercises: Array<
    SessionExercise & {
      sets: SetLog[];
      last_session_set: {
        session_name: string;
        started_at: Date;
        reps: number;
        weight: string | null;
      } | null;
    }
  >;
};

export type SessionListItem = WorkoutSession & {
  exercise_count: number;
  set_count: number;
};

export type AnalyticsSummary = {
  sessions: number;
  sets: number;
  reps: number;
  tonnage: number;
  topExercises: Array<{
    exercise_name_snapshot: string;
    sets: number;
    reps: number;
    tonnage: number;
  }>;
};

export async function listExercises() {
  return sql<Exercise[]>`
    select
      id,
      name,
      muscle_group,
      equipment,
      notes,
      archived_at,
      created_at
    from exercises
    where archived_at is null
    order by name asc
  `;
}

export async function createExercise(input: unknown) {
  const parsed = exerciseInputSchema.parse(input);
  const [created] = await sql<Exercise[]>`
    insert into exercises (name, muscle_group, equipment, notes)
    values (${parsed.name}, ${parsed.muscleGroup}, ${parsed.equipment}, ${parsed.notes})
    on conflict (name) do update
      set muscle_group = excluded.muscle_group,
          equipment = excluded.equipment,
          notes = excluded.notes,
          archived_at = null
    returning id, name, muscle_group, equipment, notes, archived_at, created_at
  `;
  return created;
}

export async function archiveExercise(exerciseId: string) {
  await sql`
    update exercises
    set archived_at = now()
    where id = ${exerciseId}
  `;
}

export async function listTemplates() {
  return sql<TemplateSummary[]>`
    select
      t.id,
      t.name,
      t.description,
      t.created_at,
      coalesce(count(te.id), 0)::int as exercise_count
    from split_templates t
    left join split_template_exercises te on te.template_id = t.id
    group by t.id
    order by t.created_at desc
  `;
}

export async function createTemplate(input: unknown) {
  const parsed = templateInputSchema.parse(input);
  const [created] = await sql<SplitTemplate[]>`
    insert into split_templates (name, description)
    values (${parsed.name}, ${parsed.description})
    on conflict (name) do update
      set description = excluded.description
    returning id, name, description, created_at
  `;
  return created;
}

export async function getTemplateById(templateId: string) {
  const [template] = await sql<SplitTemplate[]>`
    select id, name, description, created_at
    from split_templates
    where id = ${templateId}
  `;

  if (!template) {
    return null;
  }

  const exercises = await sql<SplitTemplateExercise[]>`
    select
      te.id,
      te.template_id,
      te.exercise_id,
      te.order_index,
      te.default_sets,
      te.default_rep_min,
      te.default_rep_max,
      te.notes,
      e.name as exercise_name
    from split_template_exercises te
    join exercises e on e.id = te.exercise_id
    where te.template_id = ${templateId}
      and e.archived_at is null
    order by te.order_index asc
  `;

  return {
    template,
    exercises,
  };
}

export async function addExerciseToTemplate(input: unknown) {
  const parsed = templateExerciseInputSchema.parse(input);

  await sql.begin(async (tx) => {
    const db = tx as unknown as typeof sql;

    const [nextOrder] = await db<{ next_order: number }[]>`
      select coalesce(max(order_index), 0)::int + 1 as next_order
      from split_template_exercises
      where template_id = ${parsed.templateId}
    `;

    await db`
      insert into split_template_exercises (
        template_id,
        exercise_id,
        order_index,
        default_sets,
        default_rep_min,
        default_rep_max,
        notes
      )
      values (
        ${parsed.templateId},
        ${parsed.exerciseId},
        ${nextOrder.next_order},
        ${parsed.defaultSets ?? null},
        ${parsed.defaultRepMin ?? null},
        ${parsed.defaultRepMax ?? null},
        ${parsed.notes}
      )
      on conflict (template_id, exercise_id) do nothing
    `;
  });
}

export async function addExercisesToTemplate(templateId: string, exerciseIds: string[]) {
  const uniqueIds = Array.from(new Set(exerciseIds.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return;
  }

  await sql.begin(async (tx) => {
    const db = tx as unknown as typeof sql;

    const [nextOrder] = await db<{ next_order: number }[]>`
      select coalesce(max(order_index), 0)::int + 1 as next_order
      from split_template_exercises
      where template_id = ${templateId}
    `;

    let orderIndex = nextOrder.next_order;
    for (const exerciseId of uniqueIds) {
      await db`
        insert into split_template_exercises (
          template_id,
          exercise_id,
          order_index,
          default_sets,
          default_rep_min,
          default_rep_max,
          notes
        )
        values (
          ${templateId},
          ${exerciseId},
          ${orderIndex},
          null,
          null,
          null,
          ''
        )
        on conflict (template_id, exercise_id) do nothing
      `;
      orderIndex += 1;
    }
  });
}

export async function removeTemplateExercise(templateExerciseId: string) {
  await sql.begin(async (tx) => {
    const db = tx as unknown as typeof sql;

    const [removed] = await db<{ template_id: string; order_index: number }[]>`
      delete from split_template_exercises
      where id = ${templateExerciseId}
      returning template_id, order_index
    `;

    if (!removed) {
      return;
    }

    await db`
      update split_template_exercises
      set order_index = order_index - 1
      where template_id = ${removed.template_id}
        and order_index > ${removed.order_index}
    `;
  });
}

export async function moveTemplateExercise(
  templateId: string,
  templateExerciseId: string,
  direction: "up" | "down",
) {
  await sql.begin(async (tx) => {
    const db = tx as unknown as typeof sql;

    const [current] = await db<{ id: string; order_index: number }[]>`
      select id, order_index
      from split_template_exercises
      where id = ${templateExerciseId} and template_id = ${templateId}
    `;

    if (!current) {
      return;
    }

    const targetIndex =
      direction === "up" ? current.order_index - 1 : current.order_index + 1;

    if (targetIndex < 1) {
      return;
    }

    const [target] = await db<{ id: string; order_index: number }[]>`
      select id, order_index
      from split_template_exercises
      where template_id = ${templateId} and order_index = ${targetIndex}
    `;

    if (!target) {
      return;
    }

    const [tempOrder] = await db<{ temp_order: number }[]>`
      select coalesce(max(order_index), 0)::int + 1 as temp_order
      from split_template_exercises
      where template_id = ${templateId}
    `;

    // Use a temporary order index to avoid unique collisions during swap.
    await db`
      update split_template_exercises
      set order_index = ${tempOrder.temp_order}
      where id = ${current.id}
    `;

    await db`
      update split_template_exercises
      set order_index = ${current.order_index}
      where id = ${target.id}
    `;

    await db`
      update split_template_exercises
      set order_index = ${target.order_index}
      where id = ${current.id}
    `;
  });
}

export async function startSessionFromTemplate(templateId: string) {
  return sql.begin(async (tx) => {
    const db = tx as unknown as typeof sql;

    const [template] = await db<SplitTemplate[]>`
      select id, name, description, created_at
      from split_templates
      where id = ${templateId}
    `;

    if (!template) {
      throw new Error("Template not found.");
    }

    const templateExercises = await db<Array<{ exercise_id: string; name: string; order_index: number }>>`
      select te.exercise_id, e.name, te.order_index
      from split_template_exercises te
      join exercises e on e.id = te.exercise_id
      where te.template_id = ${templateId}
      order by te.order_index asc
    `;

    const [session] = await db<WorkoutSession[]>`
      insert into workout_sessions (template_id, name_snapshot, status)
      values (${templateId}, ${template.name}, 'active')
      returning id, template_id, name_snapshot, started_at, ended_at, status
    `;

    for (const item of templateExercises) {
      await db`
        insert into session_exercises (
          session_id,
          exercise_id,
          exercise_name_snapshot,
          order_index
        )
        values (
          ${session.id},
          ${item.exercise_id},
          ${item.name},
          ${item.order_index}
        )
      `;
    }

    return session.id;
  });
}

export async function completeSession(sessionId: string) {
  await sql`
    update workout_sessions
    set status = 'completed', ended_at = now()
    where id = ${sessionId} and status = 'active'
  `;
}

export async function listActiveSessions() {
  return sql<WorkoutSession[]>`
    select id, template_id, name_snapshot, started_at, ended_at, status
    from workout_sessions
    where status = 'active'
    order by started_at desc
    limit 5
  `;
}

export async function getSessionById(sessionId: string): Promise<SessionWithExercises | null> {
  const [session] = await sql<WorkoutSession[]>`
    select id, template_id, name_snapshot, started_at, ended_at, status
    from workout_sessions
    where id = ${sessionId}
  `;

  if (!session) {
    return null;
  }

  const exercises = await sql<SessionExercise[]>`
    select id, session_id, exercise_id, exercise_name_snapshot, order_index
    from session_exercises
    where session_id = ${sessionId}
    order by order_index asc
  `;

  const logs = await sql<SetLog[]>`
    select id, session_exercise_id, set_number, reps, weight, rpe, notes, logged_at
    from set_logs
    where session_exercise_id in (
      select id from session_exercises where session_id = ${sessionId}
    )
    order by session_exercise_id, set_number asc
  `;

  const lastSessionSets = await sql<
    Array<{
      session_exercise_id: string;
      session_name: string;
      started_at: Date;
      reps: number;
      weight: string | null;
    }>
  >`
    with current_session as (
      select id, template_id, started_at
      from workout_sessions
      where id = ${sessionId}
    ),
    current_exercises as (
      select id as session_exercise_id, exercise_id
      from session_exercises
      where session_id = ${sessionId}
        and exercise_id is not null
    )
    select
      ce.session_exercise_id,
      prev.session_name,
      prev.started_at,
      stats.reps,
      stats.weight
    from current_exercises ce
    join lateral (
      select
        ws.id as session_id,
        ws.name_snapshot as session_name,
        ws.started_at
      from current_session cs
      join session_exercises pse on pse.exercise_id = ce.exercise_id
      join workout_sessions ws on ws.id = pse.session_id
      where ws.status = 'completed'
        and ws.id <> cs.id
        and ws.started_at < cs.started_at
        and (cs.template_id is null or ws.template_id = cs.template_id)
      order by ws.started_at desc
      limit 1
    ) prev on true
    join lateral (
      select
        coalesce(max(sl.reps), 0)::int as reps,
        max(sl.weight) as weight
      from session_exercises pse
      join set_logs sl on sl.session_exercise_id = pse.id
      where pse.session_id = prev.session_id
        and pse.exercise_id = ce.exercise_id
    ) stats on true
  `;

  const lastSessionByExercise = new Map(
    lastSessionSets.map((item) => [item.session_exercise_id, item] as const),
  );

  return {
    session,
    exercises: exercises.map((exercise) => ({
      ...exercise,
      sets: logs.filter((log) => log.session_exercise_id === exercise.id),
      last_session_set: lastSessionByExercise.get(exercise.id) ?? null,
    })),
  };
}

export async function addSetLog(input: unknown) {
  const parsed = addSetInputSchema.parse(input);

  const [setLog] = await sql.begin(async (tx) => {
    const db = tx as unknown as typeof sql;

    const [nextSet] = await db<{ next_set: number }[]>`
      select coalesce(max(set_number), 0)::int + 1 as next_set
      from set_logs
      where session_exercise_id = ${parsed.sessionExerciseId}
    `;

    const [created] = await db<SetLog[]>`
      insert into set_logs (session_exercise_id, set_number, reps, weight, rpe, notes)
      values (
        ${parsed.sessionExerciseId},
        ${nextSet.next_set},
        ${parsed.reps},
        ${parsed.weight ?? null},
        ${parsed.rpe ?? null},
        ${parsed.notes}
      )
      returning id, session_exercise_id, set_number, reps, weight, rpe, notes, logged_at
    `;

    return [created];
  });

  return setLog;
}

export async function listSessions(limit = 50) {
  return sql<SessionListItem[]>`
    select
      s.id,
      s.template_id,
      s.name_snapshot,
      s.started_at,
      s.ended_at,
      s.status,
      coalesce(count(distinct se.id), 0)::int as exercise_count,
      coalesce(count(sl.id), 0)::int as set_count
    from workout_sessions s
    left join session_exercises se on se.session_id = s.id
    left join set_logs sl on sl.session_exercise_id = se.id
    group by s.id
    order by s.started_at desc
    limit ${limit}
  `;
}

export async function getDashboardStats() {
  const [exerciseCount] = await sql<{ total: number }[]>`
    select count(*)::int as total from exercises where archived_at is null
  `;

  const [templateCount] = await sql<{ total: number }[]>`
    select count(*)::int as total from split_templates
  `;

  const [sessionCount] = await sql<{ total: number }[]>`
    select count(*)::int as total from workout_sessions where status = 'completed'
  `;

  const [activeSession] = await sql<WorkoutSession[]>`
    select id, template_id, name_snapshot, started_at, ended_at, status
    from workout_sessions
    where status = 'active'
    order by started_at desc
    limit 1
  `;

  return {
    exerciseCount: exerciseCount?.total ?? 0,
    templateCount: templateCount?.total ?? 0,
    completedSessions: sessionCount?.total ?? 0,
    activeSession: activeSession ?? null,
  };
}

export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const [summary] = await sql<[{ sessions: number; sets: number; reps: number; tonnage: string }]>`
    select
      count(distinct s.id)::int as sessions,
      coalesce(count(sl.id), 0)::int as sets,
      coalesce(sum(sl.reps), 0)::int as reps,
      coalesce(sum(sl.reps * coalesce(sl.weight, 0)), 0)::numeric(12, 2)::text as tonnage
    from workout_sessions s
    left join session_exercises se on se.session_id = s.id
    left join set_logs sl on sl.session_exercise_id = se.id
    where s.status = 'completed'
      and s.started_at >= now() - (${days} * interval '1 day')
  `;

  const topExercises = await sql<
    Array<{ exercise_name_snapshot: string; sets: number; reps: number; tonnage: string }>
  >`
    select
      se.exercise_name_snapshot,
      count(sl.id)::int as sets,
      coalesce(sum(sl.reps), 0)::int as reps,
      coalesce(sum(sl.reps * coalesce(sl.weight, 0)), 0)::numeric(12, 2)::text as tonnage
    from set_logs sl
    join session_exercises se on se.id = sl.session_exercise_id
    join workout_sessions s on s.id = se.session_id
    where s.status = 'completed'
      and s.started_at >= now() - (${days} * interval '1 day')
    group by se.exercise_name_snapshot
    order by count(sl.id) desc, sum(sl.reps) desc
    limit 8
  `;

  return {
    sessions: summary?.sessions ?? 0,
    sets: summary?.sets ?? 0,
    reps: summary?.reps ?? 0,
    tonnage: Number(summary?.tonnage ?? "0"),
    topExercises: topExercises.map((item) => ({
      exercise_name_snapshot: item.exercise_name_snapshot,
      sets: item.sets,
      reps: item.reps,
      tonnage: Number(item.tonnage ?? "0"),
    })),
  };
}
