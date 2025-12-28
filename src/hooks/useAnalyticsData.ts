import { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { eachDayOfInterval, subDays, format } from 'date-fns';

export const useAnalyticsData = () => {
    const { habits, loading } = useHabits();

    const data = useMemo(() => {
        if (loading || habits.length === 0) {
            return {
                trendData: [],
                categoryData: [],
                totalCompletions: 0,
                bestHabit: null,
                completionRate: 0,
                totalHabits: 0
            };
        }

        // 1. Trend Data (Last 30 Days)
        const trendData = eachDayOfInterval({
            start: subDays(new Date(), 29),
            end: new Date()
        }).map(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const count = habits.reduce((acc, h) => {
                return acc + (h.completedDates.includes(dateStr) ? 1 : 0);
            }, 0);
            return {
                date: format(date, 'MMM dd'),
                count
            };
        });

        // 2. Category Data
        const categoryMap = habits.reduce((acc, habit) => {
            const completions = habit.completedDates.length;
            if (completions > 0) {
                acc[habit.category] = (acc[habit.category] || 0) + completions;
            }
            return acc;
        }, {} as Record<string, number>);

        const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

        // 3. Quick Stats
        const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);

        const bestHabit = habits.reduce((prev, current) =>
            (prev.streak > current.streak) ? prev : current
            , habits[0]);

        // Completion Rate (Approximation: Total Completions / (Total Habits * 30 days) - simplistic)
        // Better: Total Completions / Sum of (Habit Age in Days * Frequency Target)? 
        // User suggested: "completions / (days * active habits)"
        // Let's use last 30 days window for rate to be relevant.
        // Potential completions in last 30 days:
        let potentialCompletions = 0;
        // Approximation: Habits * 30 (assuming daily). 
        // Better: Check frequency for each habit in last 30 days.
        // For MVP speed, let's just do: Total Completions / (Habits * CreationDateDiff or 30?)
        // Let's stick to "Global Completion Rate" = Total Completions / (All Habits * Days since joined?)
        // Let's use the USER's formula: completions / (days * active habits)
        // Assuming "days" = 30 for the trend window.

        potentialCompletions = habits.length * 30; // Rough estimate
        // const completionRate = potentialCompletions > 0 
        //     ? Math.round((totalCompletions / potentialCompletions) * 100) 
        //     : 0; 
        // Note: totalCompletions is ALL time, so this ratio is weird.
        // Let's recalculate totalCompletions for *just* last 30 days to match the rate window.

        const completionsLast30 = trendData.reduce((acc, d) => acc + d.count, 0);
        const rateLast30 = potentialCompletions > 0 ? Math.round((completionsLast30 / potentialCompletions) * 100) : 0;


        return {
            trendData,
            categoryData,
            totalCompletions, // All time
            bestHabit: { name: bestHabit.name, streak: bestHabit.streak },
            completionRate: rateLast30, // Last 30 days rate
            totalHabits: habits.length
        };

    }, [habits, loading]);

    return { ...data, loading };
};
