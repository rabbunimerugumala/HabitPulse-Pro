import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { GreetingHeader } from '../components/dashboard/GreetingHeader';
import { StatsRow } from '../components/dashboard/StatsRow';
import { AICoachCard } from '../components/dashboard/AICoachCard';
import { HabitList } from '../components/habits/HabitList';
import { useHabits } from '../context/HabitContext';
import { Heatmap } from '../components/charts/Heatmap';
import { FaCalendarAlt } from 'react-icons/fa';

export const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { getHabitsByDate, toggleHabit, openAddModal } = useHabits();
    const navigate = useNavigate();

    const todaysHabits = getHabitsByDate(new Date());

    // Derive unique categories from today's habits
    const categories = useMemo(() => {
        const cats = new Set(todaysHabits.map(h => h.category));
        return ["All", ...Array.from(cats)];
    }, [todaysHabits]);

    return (
        <AppLayout>
            <GreetingHeader />
            {/* Top Section */}
            <div className="space-y-8">
                {/* 1) Today's Focus Row */}
                <div>
                    <div className="mb-4 lg:mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-bold whitespace-nowrap">Today's Focus</h2>
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-2 no-scrollbar">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-sm font-medium border-b-2 pb-1 transition-colors whitespace-nowrap px-1 ${selectedCategory === cat
                                            ? "text-white border-primary"
                                            : "text-muted border-transparent hover:text-white"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Calendar Link */}
                            <button
                                onClick={() => navigate('/calendar')}
                                className="flex items-center gap-1.5 text-sm text-primary hover:text-white font-medium transition-colors"
                            >
                                <FaCalendarAlt />
                                <span className="hidden sm:inline">View Calendar</span>
                            </button>

                            {/* Desktop Add Habit Button */}
                            <button
                                onClick={openAddModal}
                                className="hidden sm:flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-primaryAlt rounded-full text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <span>+</span> Add Habit
                            </button>
                        </div>
                    </div>

                    <HabitList filterCategory={selectedCategory} onHabitClick={toggleHabit} />
                </div>

                {/* 2) Your Progress Row */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Your Progress</h2>
                    <StatsRow />
                </div>

                {/* 3) Consistency Map Row (Full Width on Desktop) */}
                <div className="pt-2">
                    <div className="glass-card p-8 border border-border">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            📅 Consistency Map
                        </h3>
                        <Heatmap />
                        <p className="text-xs text-muted mt-4 italic">
                            "Success is the sum of small efforts, repeated day in and day out."
                        </p>
                    </div>
                </div>

                {/* AI Coach (Stacked at bottom for now or move up if preferred, request asked for Map below Stats) */}
                <div className="pt-4">
                    <AICoachCard />
                </div>
            </div>
        </AppLayout>
    );
};
