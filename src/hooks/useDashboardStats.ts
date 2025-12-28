import { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export const useDashboardStats = () => {
    const { habits, loading } = useHabits();

    const stats = useMemo(() => {
        if (loading || habits.length === 0) {
            return {
                currentStreak: 0,
                completedToday: 0,
                totalActiveToday: 0,
                weeklyAverage: 0
            };
        }

        const todayStr = format(new Date(), 'yyyy-MM-dd');

        // 1. Completed Today
        // Count unique habits completed today
        const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;

        // Total active habits for today (simplified: checking frequency.days includes today)
        const dayIndex = new Date().getDay(); // 0-6
        const totalActiveToday = habits.filter(h => {
            if (h.frequency.type === 'daily') return true;
            // Weekly/Custom: check if today is in the list
            if (h.frequency.type === 'weekly' || h.frequency.type === 'custom') {
                return h.frequency.days?.includes(dayIndex) || (h.frequency.days?.length === 0);
            }
            return true;
        }).length;

        // 2. Weekly Average (Last 7 days)
        const last7Days = eachDayOfInterval({
            start: subDays(new Date(), 6),
            end: new Date()
        });

        let totalPotential = 0;
        let totalCompleted = 0;

        last7Days.forEach(date => {
            const dStr = format(date, 'yyyy-MM-dd');
            const dIndex = date.getDay();

            habits.forEach(h => {
                // Check if habit should be done on this date
                let isDue = false;
                if (h.frequency.type === 'daily') isDue = true;
                else if (h.frequency.days?.includes(dIndex) || h.frequency.days?.length === 0) isDue = true;

                if (isDue) {
                    totalPotential++;
                    if (h.completedDates.includes(dStr)) totalCompleted++;
                }
            });
        });

        const weeklyAverage = totalPotential > 0 ? Math.round((totalCompleted / totalPotential) * 100) : 0;

        // 3. User Current Streak (Consecutive days with at least 1 completion)
        // Get all unique completion dates across all habits
        const allCompletionDates = new Set<string>();
        habits.forEach(h => h.completedDates.forEach(d => allCompletionDates.add(d)));
        const sortedDates = Array.from(allCompletionDates).sort((a, b) => b.localeCompare(a)); // Descending

        let streak = 0;
        let checkDate = new Date();

        // Check today first. If no completions today, streak might still be valid if yesterday was completed.
        // Actually, for "Current Streak", if I haven't done today's yet, my streak is from yesterday.
        // If I HAVE done today's, include today.

        // Simple logic: Check today, if present streak++; then yesterday...
        // If today NOT present, check yesterday. If yesterday present, streak starts from yesterday.
        // If yesterday NOT present, streak is 0.

        const hasToday = sortedDates.includes(todayStr);
        if (hasToday) {
            streak++;
            checkDate = subDays(checkDate, 1);
        } else {
            // Check yesterday
            const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
            if (!sortedDates.includes(yesterdayStr)) {
                // Streak broken
                streak = 0;
            }
            // If yesterday exists, we start counting backwards from yesterday in the loop nicely? 
            // Actually let's just loop backwards from yesterday always if we handled today separately.
        }

        // Correct loop:
        // We verified 'checkDate' (either today or yesterday depending on hasToday) needs to be checked? 
        // Wait, if hasToday is true, checkDate is yesterday.
        // If hasToday is false, we leave checkDate as today? No.

        // Let's restart streak logic.
        let currentStreak = 0;
        let pointer = new Date(); // Start checking from Today

        // Normalize pointer to midnight if needed, but we use string format
        if (!hasToday) {
            // If nothing done today, allow streak to continue from yesterday
            pointer = subDays(pointer, 1);
        }

        while (true) {
            const pStr = format(pointer, 'yyyy-MM-dd');
            if (sortedDates.includes(pStr)) {
                currentStreak++;
                pointer = subDays(pointer, 1);
            } else {
                break;
            }
        }

        return {
            currentStreak,
            completedToday,
            totalActiveToday,
            weeklyAverage
        };

    }, [habits, loading]);

    return stats;
};
