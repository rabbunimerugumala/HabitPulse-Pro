import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { BackButton } from '../components/ui/BackButton';
import { useHabits } from '../context/HabitContext';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth, isSameDay, subMonths, addMonths, startOfWeek, endOfWeek } from 'date-fns';
import { clsx } from 'clsx';
import { FaFire, FaCheckCircle, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTrophy } from 'react-icons/fa';

export const HabitDetail = () => {
    const { id } = useParams();
    const { habits, toggleHabit } = useHabits();
    const habit = habits.find(h => h.id === id);

    const [currentMonth, setCurrentMonth] = useState(new Date());

    if (!habit) {
        return (
            <AppLayout>
                <div className="p-8 text-center pt-20">
                    <h2 className="text-xl font-bold mb-4">Habit not found</h2>
                    <BackButton fallbackPath="/habits" label="Go Back to Habits" />
                </div>
            </AppLayout>
        );
    }

    // Stats Logic
    const totalCompletions = Object.values(habit.completions || {}).filter(Boolean).length;
    const createdDate = habit.created_at ? new Date(habit.created_at) : new Date();
    const formattedCreatedDate = format(createdDate, 'MMMM do, yyyy');

    // Calendar Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const calendarDeys = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <BackButton fallbackPath="/habits" />
                        <div className="min-w-0">
                            <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2 md:gap-3 truncate">
                                <span className="truncate">{habit.name}</span>
                                <span className={clsx("text-[10px] md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full border shrink-0",
                                    "bg-white/5 border-white/10 text-gray-400 font-normal")}>
                                    {habit.category}
                                </span>
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Created on {formattedCreatedDate}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
                    {/* Streak Card */}
                    <div className="glass-card p-4 md:p-6 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FaFire size={80} />
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center text-xl md:text-2xl">
                            <FaFire />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs md:text-sm font-medium">Current Streak</p>
                            <p className="text-2xl md:text-3xl font-bold text-white">{habit.streak} <span className="text-xs md:text-sm text-gray-500 font-normal">days</span></p>
                        </div>
                    </div>

                    {/* Total Completions Card */}
                    <div className="glass-card p-4 md:p-6 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FaCheckCircle size={80} />
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-green-500/20 text-green-500 flex items-center justify-center text-xl md:text-2xl">
                            <FaCheckCircle />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs md:text-sm font-medium">Total Check-ins</p>
                            <p className="text-2xl md:text-3xl font-bold text-white">{totalCompletions} <span className="text-xs md:text-sm text-gray-500 font-normal">times</span></p>
                        </div>
                    </div>

                    {/* Consistency/Best Streak (Placeholder for now or derived) */}
                    <div className="glass-card p-4 md:p-6 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FaTrophy size={80} />
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center text-xl md:text-2xl">
                            <FaTrophy />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs md:text-sm font-medium">Best Streak</p>
                            {/* Note: Best streak is not yet tracked in DB, using current for now or placeholder */}
                            <p className="text-2xl md:text-3xl font-bold text-white">{habit.streak} <span className="text-xs md:text-sm text-gray-500 font-normal">high score</span></p>
                        </div>
                    </div>
                </div>

                {/* History Calendar */}
                <div className="glass-card p-4 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            History
                        </h3>
                        <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                            <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white">
                                <FaChevronLeft size={14} />
                            </button>
                            <span className="w-32 text-center font-medium">
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white">
                                <FaChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="max-w-[320px] md:max-w-none mx-auto">
                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 md:gap-2">
                            {calendarDeys.map((day) => {
                                const dateStr = format(day, 'yyyy-MM-dd');
                                const isCompleted = habit.completions && habit.completions[dateStr] === true;
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const isToday = isSameDay(day, new Date());
                                const dayNumber = format(day, 'd');
                                const tooltipText = format(day, 'MMM d, yyyy');

                                // Interaction Logic: Can only toggle Today or Past
                                const isFuture = day > new Date();
                                const isClickable = !isFuture;

                                const handleToggle = async () => {
                                    if (!isClickable) return;
                                    await toggleHabit(habit, dateStr);
                                };

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={handleToggle}
                                        disabled={!isClickable}
                                        className={clsx(
                                            "aspect-square rounded-lg flex items-center justify-center text-sm relative transition-all duration-300 group",
                                            !isCurrentMonth && "opacity-20 grayscale",
                                            isCompleted
                                                ? "bg-[var(--habit-color)] text-white shadow-lg shadow-[var(--habit-glow)] scale-100"
                                                : "bg-white/5 text-gray-500 hover:bg-white/10",

                                            // Today styling
                                            isToday && !isCompleted && "ring-1 ring-orange-500 text-orange-500",
                                            isToday && isCompleted && "ring-2 ring-white",

                                            // Clickable cues
                                            isClickable ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default opacity-50"
                                        )}
                                        style={{
                                            '--habit-color': habit.color || '#3b82f6',
                                            '--habit-glow': `${habit.color}66` || '#3b82f666'
                                        } as React.CSSProperties}
                                    >
                                        {dayNumber}
                                        {isCompleted && (
                                            <div className="absolute inset-0 bg-white/10 rounded-lg animate-pulse" />
                                        )}

                                        {/* Custom Tooltip */}
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-900 border border-white/10 rounded-md text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl whitespace-nowrap">
                                            {tooltipText}
                                            {isCompleted && <span className="text-[var(--habit-color)] ml-1 font-bold">•</span>}
                                            {/* Little arrow at bottom */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
