import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

export const CompletionTrendChart = ({ data }: { data: any[] }) => {
    return (
        <div className="w-full h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
