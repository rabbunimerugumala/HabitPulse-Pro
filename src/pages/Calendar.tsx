import { AppLayout } from '../components/layout/AppLayout';
import { Heatmap } from '../components/charts/Heatmap';
import { useHabits } from '../context/HabitContext';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { FaCheck } from 'react-icons/fa';

export const Calendar = () => {
    const { habits } = useHabits();

    // Last 7 days detail text
    const last7Days = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date()
    }).reverse();

    return (
        <AppLayout>
            <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
                <h1 className="text-3xl font-bold mb-2">Completion History</h1>
                <p className="text-gray-400 mb-8">Visualizing your consistency over time.</p>

                <div className="glass-card p-6 mb-8 overflow-hidden">
                    <h2 className="text-lg font-semibold mb-4">Activity Map</h2>
                    <Heatmap />
                </div>

                <h2 className="text-xl font-bold mb-4">Last 7 Days</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {last7Days.map(date => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const completedHabits = habits.filter(h => h.completedDates.includes(dateStr));

                        return (
                            <div key={dateStr} className="glass p-4 rounded-xl border-l-2 border-white/10 hover:border-neon-purple transition-all">
                                <h3 className="font-bold mb-2">{format(date, 'EEEE, MMM do')}</h3>
                                {completedHabits.length > 0 ? (
                                    <div className="space-y-2">
                                        {completedHabits.map(h => (
                                            <div key={h.id} className="flex items-center gap-2 text-sm text-gray-300">
                                                <div className="w-5 h-5 rounded-full bg-neon-green/20 flex items-center justify-center text-[10px] text-neon-green">
                                                    <FaCheck />
                                                </div>
                                                {h.name}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No habits completed.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
};
