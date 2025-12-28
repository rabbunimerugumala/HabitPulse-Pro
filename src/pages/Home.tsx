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
    const { getHabitsByDate, toggleHabit } = useHabits();
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
            <StatsRow />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Habits & Coach */}
                <div className="lg:col-span-2 space-y-8">
                    <AICoachCard />

                    <div>
                        <div className="mb-6 flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1 mr-2">
                                <h2 className="text-xl font-bold whitespace-nowrap">Today's Focus</h2>
                                <div className="flex gap-2 mt-2 overflow-x-auto pb-2 no-scrollbar">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`text-sm font-medium border-b-2 pb-1 transition-colors whitespace-nowrap px-1 ${selectedCategory === cat
                                                ? "text-white border-neon-blue"
                                                : "text-gray-400 border-transparent hover:text-white"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Calendar Link - Anchored right, stays on line */}
                            <button
                                onClick={() => navigate('/calendar')}
                                className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm text-neon-blue hover:text-white font-medium transition-colors mt-1.5"
                            >
                                <FaCalendarAlt className="text-sm sm:text-base" />
                                <span>View Calendar</span>
                            </button>
                        </div>

                        <HabitList filterCategory={selectedCategory} onHabitClick={toggleHabit} />
                    </div>
                </div>

                {/* Right Column: Calendar (Desktop Only) */}
                <div className="hidden lg:block space-y-6">
                    <div className="glass p-6 rounded-2xl border border-white/10 sticky top-4">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            📅 Consistency Map
                        </h3>
                        <Heatmap />
                        <p className="text-xs text-gray-500 mt-4 italic">
                            "Success is the sum of small efforts, repeated day in and day out."
                        </p>
                    </div>
                </div>
            </div>

        </AppLayout>
    );
};
