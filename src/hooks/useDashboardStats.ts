import { useState, useEffect, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import { calculateCurrentStreak } from '../services/habitService';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export const useDashboardStats = () => {
    const { habits, loading } = useHabits();
    const { user } = useAuth();
    const [currentStreak, setCurrentStreak] = useState(0);

    // Fetch real streak from Supabase whenever habits change (completion update)
    useEffect(() => {
        const fetchStreak = async () => {
            if (user?.id) {
                const streak = await calculateCurrentStreak(user.id);
                setCurrentStreak(streak);
            }
        };
        fetchStreak();
    }, [user?.id, habits]);

    const stats = useMemo(() => {
        if (loading || habits.length === 0) {
            return {
                currentStreak,
                completedToday: 0,
                totalActiveToday: 0,
                weeklyAverage: 0
            };
        }

        const todayStr = format(new Date(), 'yyyy-MM-dd');

        // 1. Completed Today
        const completedToday = habits.filter(h => h.completions && h.completions[todayStr] === true).length;

        // Total active habits for today
        const dayIndex = new Date().getDay(); // 0-6
        const totalActiveToday = habits.filter(h => {
            if (h.frequency.type === 'daily') return true;
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
                let isDue = false;
                if (h.frequency.type === 'daily') isDue = true;
                else if (h.frequency.days?.includes(dIndex) || h.frequency.days?.length === 0) isDue = true;

                if (isDue) {
                    totalPotential++;
                    if (h.completions && h.completions[dStr] === true) totalCompleted++;
                }
            });
        });

        const weeklyAverage = totalPotential > 0 ? Math.round((totalCompleted / totalPotential) * 100) : 0;

        return {
            currentStreak,
            completedToday,
            totalActiveToday,
            weeklyAverage
        };

    }, [habits, loading, currentStreak]);

    return stats;
};
