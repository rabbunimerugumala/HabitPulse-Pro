import { FaFire, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { clsx } from 'clsx';
import { useDashboardStats } from '../../hooks/useDashboardStats';

const StatCard = ({ icon: Icon, label, value, colorClass, delay }: any) => (
    <div
        className={clsx(
            "glass-card p-5 border-l-4 flex items-center gap-4 transition-transform hover:scale-105",
            colorClass, // border-warning, etc.
            "animate-in zoom-in-50 fade-in duration-500 fill-mode-backwards"
        )}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-white/5", colorClass.replace('border-', 'text-'))}>
            <Icon />
        </div>
        <div>
            <p className="text-muted text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold font-heading text-white">{value}</p>
        </div>
    </div>
);

export const StatsRow = () => {
    const { currentStreak, completedToday, totalActiveToday, weeklyAverage } = useDashboardStats();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
                icon={FaFire}
                label="Current Streak"
                value={`${currentStreak} Days`}
                colorClass="border-warning"
                delay={0}
            />
            <StatCard
                icon={FaCheckCircle}
                label="Completed Today"
                value={`${completedToday}/${totalActiveToday}`}
                colorClass="border-success"
                delay={100}
            />
            <StatCard
                icon={FaChartLine}
                label="Weekly Average"
                value={`${weeklyAverage}%`}
                colorClass="border-primary"
                delay={200}
            />
        </div>
    );
};
