import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { BackButton } from '../components/ui/BackButton';
import { useHabits } from '../context/HabitContext';

export const HabitDetail = () => {
    const { id } = useParams();
    const { habits } = useHabits();
    const habit = habits.find(h => h.id === id);

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

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500">
                <div className="flex items-center gap-4 mb-6">
                    <BackButton fallbackPath="/habits" />
                    <h1 className="text-2xl font-bold">{habit.name}</h1>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400">Category</span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                            {habit.category}
                        </span>
                    </div>
                    <p className="text-gray-400">Detailed stats and history for this habit will appear here.</p>
                </div>
            </div>
        </AppLayout>
    );
};
