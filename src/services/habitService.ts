import { supabase } from "../config/supabaseClient";
import { format, subDays } from 'date-fns';

export interface Habit {
    id?: string;
    user_id: string; // Changed from userId to user_id to match SQL
    name: string;
    description?: string;
    category: string;
    color: string;
    icon: string;
    frequency: {
        type: 'daily' | 'weekly' | 'custom';
        days?: number[]; // 0-6 (Sun-Sat)
    };
    reminder: {
        enabled: boolean;
        time: string;
    };
    streak: number;
    completions: Record<string, boolean>; // Changed from completedDates: string[]
    created_at: any;
}

export const createHabit = async (habitData: Omit<Habit, 'id' | 'created_at' | 'streak' | 'completions'>) => {
    const { user_id, name, category, color, icon, frequency, reminder } = habitData;

    const { data, error } = await supabase.from('habits').insert({
        user_id,
        name,
        category,
        color,
        icon,
        frequency_type: frequency.type,
        frequency_days: frequency.days || null,
        reminder_enabled: reminder.enabled,
        reminder_time: reminder.time,
        current_streak: 0,
        total_completions: 0
    }).select().single();

    if (error) throw error;
    return data;
};

// Simplified fetch instead of Realtime subscription for MVP migration step
// Realtime requires more setup with Supabase channels. 
// We will return a standard Promise<Habit[]> here.
export const fetchHabits = async (userId: string) => {
    // 1. Fetch Habits
    const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (habitsError) throw habitsError;
    if (!habits) return [];

    // 2. Fetch Completions for these habits
    // Ideally user ID filter is enough
    const { data: completions, error: completionsError } = await supabase
        .from('completions')
        .select('habit_id, date')
        .eq('user_id', userId);

    if (completionsError) throw completionsError;

    // 3. Map completions to habits
    return habits.map((h: any) => {
        const habitCompletions: Record<string, boolean> = {};
        if (completions) {
            completions
                .filter((c: any) => c.habit_id === h.id)
                .forEach((c: any) => {
                    habitCompletions[c.date] = true;
                });
        }

        return {
            ...h,
            frequency: {
                type: h.frequency_type,
                days: h.frequency_days || []
            },
            reminder: {
                enabled: h.reminder_enabled,
                time: h.reminder_time
            },
            streak: h.current_streak, // map DB column to frontend prop
            completions: habitCompletions
        };
    }) as Habit[];
};

export const toggleHabitCompletion = async (habit: Habit, dateStr: string) => {
    if (!habit.id) return;
    const isCompleted = habit.completions[dateStr] === true;

    if (isCompleted) {
        // DELETE completion
        const { error } = await supabase
            .from('completions')
            .delete()
            .eq('habit_id', habit.id)
            .eq('date', dateStr);
        if (error) throw error;

        // DECREMENT streak logic (simplified)
        const newStreak = Math.max(0, habit.streak - 1);
        await supabase.from('habits').update({ current_streak: newStreak }).eq('id', habit.id);

    } else {
        // INSERT completion
        const { error } = await supabase
            .from('completions')
            .insert({
                user_id: habit.user_id,
                habit_id: habit.id,
                date: dateStr,
                completed: true
            });
        if (error) throw error;

        // INCREMENT streak
        const newStreak = habit.streak + 1;
        await supabase.from('habits').update({ current_streak: newStreak }).eq('id', habit.id);
    }
};

export const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    // Prepare update payload - ensure frequency is serialised correctly if present
    const payload: any = { ...updates };

    if (updates.frequency) {
        payload.frequency_type = updates.frequency.type;
        payload.frequency_days = updates.frequency.days || null;
        delete payload.frequency;
    }

    if (updates.reminder) {
        payload.reminder_enabled = updates.reminder.enabled;
        payload.reminder_time = updates.reminder.time;
        delete payload.reminder;
    }

    const { data, error } = await supabase
        .from('habits')
        .update(payload)
        .eq('id', habitId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteHabit = async (habitId: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', habitId);
    if (error) throw error;
};

// --- AI Insights ---

export const fetchLatestInsight = async (userId: string) => {
    const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', userId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data;
};

export const createInsight = async (userId: string, summary: string, recommendations: any = {}) => {
    const { data, error } = await supabase
        .from('ai_insights')
        .insert({
            user_id: userId,
            summary,
            recommendations,
            range_start: new Date().toISOString(), // Mock range
            range_end: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const calculateCurrentStreak = async (userId: string) => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    // Query completions (last 30 days limit as requested)
    // Note: This caps calculated streak at 30 for optimization. 
    // To allow longer streaks, we would need to remove the date filter or increase it.
    const { data } = await supabase
        .from('completions')
        .select('date')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('date', format(thirtyDaysAgo, 'yyyy-MM-dd'))
        .order('date', { ascending: false });

    if (!data || data.length === 0) return 0;

    // Get unique dates
    const uniqueDates = Array.from(new Set(data.map(d => d.date)));
    const sortedDates = uniqueDates.sort((a, b) => b.localeCompare(a)); // Descending

    let streak = 0;
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

    // Check where to start counting
    let checkDateStr = todayStr;

    // If today is not completed, we check if yesterday was completed to keep the streak alive
    if (!sortedDates.includes(todayStr)) {
        if (sortedDates.includes(yesterdayStr)) {
            checkDateStr = yesterdayStr;
        } else {
            return 0; // Streak broken
        }
    }

    // Iterate backwards
    let currentDate = new Date(checkDateStr);

    while (true) {
        const dStr = format(currentDate, 'yyyy-MM-dd');
        if (sortedDates.includes(dStr)) {
            streak++;
            currentDate = subDays(currentDate, 1);
        } else {
            break;
        }
    }

    return streak;
};
