import { useMemo } from 'react';
import { eachDayOfInterval, format, subDays } from 'date-fns';
import { clsx } from 'clsx';
import { useHabits } from '../../context/HabitContext';

export const Heatmap = () => {
    const { habits } = useHabits();

    // Generate last 100 days
    const days = useMemo(() => {
        const today = new Date();
        // Ensure we start on a Monday/Sunday to align the grid
        const end = today;
        const start = subDays(today, 120); // roughly 4 months
        const allDays = eachDayOfInterval({ start, end });
        return allDays;
    }, []);

    // Calculate intensity for each day
    const getIntensity = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        let completedCount = 0;
        let totalActive = 0;

        habits.forEach(h => {
            // Check if this habit was active on this date (simple check: created before)
            // For MVP assume all current habits were active
            totalActive++;
            if (h.completedDates.includes(dateStr)) {
                completedCount++;
            }
        });

        if (totalActive === 0) return 0;
        return completedCount / totalActive;
    };

    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex gap-1 min-w-max">
                {/* We want a grid of 7 rows (days of week) x N columns (weeks) */}
                {/* But standard flex wrap is row-first. CSS Grid is better here. */}
                {/* Let's try a simple CSS Grid with 7 rows */}
                <div
                    className="grid grid-rows-7 grid-flow-col gap-1.5"
                    style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
                >
                    {days.map((date) => {
                        const intensity = getIntensity(date);
                        const intensityColor =
                            intensity === 0 ? "bg-white/5 border-white/5" :
                                intensity < 0.4 ? "bg-primary/30 border-primary/30" :
                                    intensity < 0.7 ? "bg-primary/60 border-primary/50" :
                                        "bg-primary border-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]";

                        return (
                            <div
                                key={date.toISOString()}
                                className={clsx(
                                    "w-3 h-3 md:w-4 md:h-4 rounded-sm border transition-all hover:scale-125 relative group",
                                    intensityColor
                                )}
                            >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 whitespace-nowrap bg-black/80 text-xs px-2 py-1 rounded border border-white/10 pointer-events-none">
                                    {format(date, 'MMM do')}: {Math.round(intensity * 100)}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted justify-end">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/30 border border-primary/30"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/60 border border-primary/50"></div>
                <div className="w-3 h-3 rounded-sm bg-primary border border-primary shadow-[0_0_5px_rgba(59,130,246,0.6)]"></div>
                <span>More</span>
            </div>
        </div>
    );
};
