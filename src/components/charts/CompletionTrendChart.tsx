import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { useHabits } from '../../context/HabitContext';

// Custom Tooltip for dark mode
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface border border-white/10 p-3 rounded-xl shadow-xl">
                <p className="font-bold text-gray-200 mb-1">{label}</p>
                <p className="text-neon-blue font-medium">
                    {payload[0].value} Habits Completed
                </p>
            </div>
        );
    }
    return null;
};

export const CompletionTrendChart = () => {
    const { habits } = useHabits();

    // Generate data for last 30 days
    const data = eachDayOfInterval({
        start: subDays(new Date(), 29),
        end: new Date()
    }).map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const count = habits.reduce((acc, habit) => {
            return acc + (habit.completedDates.includes(dateStr) ? 1 : 0);
        }, 0);
        return {
            date: format(date, 'MMM dd'),
            count
        };
    });

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#3B82F6', stroke: '#1A1E2E', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
