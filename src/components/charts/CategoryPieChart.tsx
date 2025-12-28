import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';


const COLORS = ['#3B82F6', '#A855F7', '#EC4899', '#10B981', '#F97316', '#F43F5E'];

export const CategoryPieChart = ({ data }: { data: any[] }) => {
    if (data.length === 0) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center text-gray-500 italic">
                Not enough data yet
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1A1E2E', borderColor: '#ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
