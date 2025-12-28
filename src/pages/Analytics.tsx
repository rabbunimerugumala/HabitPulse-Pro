import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { CompletionTrendChart } from '../components/charts/CompletionTrendChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { Button } from '../components/ui/Button';
import { FaMagic, FaChartLine, FaTrophy } from 'react-icons/fa';
import { useHabits } from '../context/HabitContext';

export const Analytics = () => {
    const { habits } = useHabits();
    const [aiLoading, setAiLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);

    // Mock AI Call
    const generateInsights = async () => {
        setAiLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAiInsight("Based on your trends, you're most consistent on Tuesdays! 🚀 Try moving your difficult habits to early week mornings. Your 'Morning Yoga' streak is inspiring!");
        setAiLoading(false);
    };

    const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
    const bestHabit = habits.reduce((prev, current) => (prev.streak > current.streak) ? prev : current, habits[0] || { name: 'None' });

    return (
        <AppLayout>
            <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
                        <p className="text-gray-400">Deep dive into your performance.</p>
                    </div>
                    <Button
                        onClick={generateInsights}
                        isLoading={aiLoading}
                        className="bg-gradient-to-r from-neon-purple to-neon-pink shadow-neon-pink/20"
                    >
                        <FaMagic className="mr-2" /> Generate AI Insights
                    </Button>
                </div>

                {/* AI Insight Card */}
                {aiInsight && (
                    <div className="glass-card p-6 mb-8 border-neon-purple/50 bg-gradient-to-br from-neon-purple/10 to-transparent animate-in zoom-in-95 duration-300">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center text-xl shrink-0">
                                ✨
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-neon-purple mb-1">AI Performance Review</h3>
                                <p className="text-gray-200 leading-relaxed">{aiInsight}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="glass p-4 rounded-xl border-l-4 border-neon-blue">
                        <p className="text-gray-400 text-xs uppercase font-bold">Total Completions</p>
                        <div className="flex items-center gap-2 mt-1">
                            <FaCheckCircle className="text-neon-blue" />
                            <p className="text-2xl font-bold">{totalCompletions}</p>
                        </div>
                    </div>

                    <div className="glass p-4 rounded-xl border-l-4 border-neon-orange">
                        <p className="text-gray-400 text-xs uppercase font-bold">Best Streak</p>
                        <div className="flex items-center gap-2 mt-1">
                            <FaFire className="text-neon-orange" />
                            <p className="text-2xl font-bold">{bestHabit?.streak || 0} <span className="text-xs text-gray-500 font-normal">({bestHabit?.name})</span></p>
                        </div>
                    </div>

                    <div className="glass p-4 rounded-xl border-l-4 border-neon-green">
                        <p className="text-gray-400 text-xs uppercase font-bold">Completion Rate</p>
                        <div className="flex items-center gap-2 mt-1">
                            <FaChartLine className="text-neon-green" />
                            <p className="text-2xl font-bold">78%</p>
                        </div>
                    </div>

                    <div className="glass p-4 rounded-xl border-l-4 border-neon-purple">
                        <p className="text-gray-400 text-xs uppercase font-bold">Total Habits</p>
                        <div className="flex items-center gap-2 mt-1">
                            <FaTrophy className="text-neon-purple" />
                            <p className="text-2xl font-bold">{habits.length}</p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold mb-4">30-Day Trend</h3>
                        <CompletionTrendChart />
                    </div>
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold mb-4">Focus Distribution</h3>
                        <CategoryPieChart />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
import { FaCheckCircle, FaFire } from 'react-icons/fa';
