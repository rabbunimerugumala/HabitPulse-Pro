import { FaFire, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { clsx } from 'clsx';

const StatCard = ({ icon: Icon, label, value, colorClass, delay }: any) => (
    <div
        className={clsx(
            "glass p-4 rounded-2xl border-l-4 flex items-center gap-4 transition-transform hover:scale-105",
            colorClass,
            "animate-in zoom-in-50 fade-in duration-500 fill-mode-backwards"
        )}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-surface/50", colorClass.replace('border-', 'text-'))}>
            <Icon />
        </div>
        <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold font-heading">{value}</p>
        </div>
    </div>
);

export const StatsRow = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
                icon={FaFire}
                label="Current Streak"
                value="12 Days"
                colorClass="border-neon-orange"
                delay={0}
            />
            <StatCard
                icon={FaCheckCircle}
                label="Completed Today"
                value="5/8"
                colorClass="border-neon-green"
                delay={100}
            />
            <StatCard
                icon={FaChartLine}
                label="Weekly Average"
                value="85%"
                colorClass="border-neon-blue"
                delay={200}
            />
        </div>
    );
};
