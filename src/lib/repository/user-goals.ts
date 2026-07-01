import { supabase } from '@/lib/supabase';
import type { CategoryId, UserGoal } from '@/lib/types';
import { requireUserId } from './_auth';

interface UserGoalRow {
  id: string;
  user_id: string;
  template_id: string;
  custom_name: string | null;
  start_date: string;
  scheduled_start_date: string | null;
  status: UserGoal['status'];
  configuration: UserGoal['configuration'];
  progress: UserGoal['progress'];
  achieved_date: string | null;
  missed_date: string | null;
}

function rowToGoal(row: UserGoalRow): UserGoal {
  return {
    id: row.id,
    templateId: row.template_id,
    customName: row.custom_name ?? undefined,
    startDate: row.start_date,
    scheduledStartDate: row.scheduled_start_date ?? undefined,
    status: row.status,
    configuration: {
      ...row.configuration,
      categoryId: row.configuration?.categoryId as CategoryId | undefined,
    },
    progress: row.progress,
    achievedDate: row.achieved_date ?? undefined,
    missedDate: row.missed_date ?? undefined,
  };
}

export async function listGoals(): Promise<UserGoal[]> {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw error;
  return (data as UserGoalRow[] | null)?.map(rowToGoal) ?? [];
}

export async function upsertGoal(goal: UserGoal): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase.from('user_goals').upsert({
    id: goal.id,
    user_id: userId,
    template_id: goal.templateId,
    custom_name: goal.customName ?? null,
    start_date: goal.startDate,
    scheduled_start_date: goal.scheduledStartDate ?? null,
    status: goal.status,
    configuration: goal.configuration,
    progress: goal.progress,
    achieved_date: goal.achievedDate ?? null,
    missed_date: goal.missedDate ?? null,
  });
  if (error) throw error;
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from('user_goals').delete().eq('id', id);
  if (error) throw error;
}
