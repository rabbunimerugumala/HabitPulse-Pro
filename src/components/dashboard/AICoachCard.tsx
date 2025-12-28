import { FaRobot, FaSyncAlt } from 'react-icons/fa';
import { Button } from '../ui/Button';

export const AICoachCard = () => {
    return (
        <div className="glass-card p-6 relative overflow-hidden mb-8 border-neon-purple/30 group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white text-xl shadow-lg shadow-neon-purple/30 shrink-0">
                        <FaRobot />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            Daily AI Insight <span className="bg-surface/50 px-2 py-0.5 rounded text-xs text-neon-purple border border-neon-purple/30">Beta</span>
                        </h3>
                        <p className="text-gray-300 mt-1 max-w-xl">
                            "You're on fire! 🎯 Maintained your 5-habit streak. Try doing your heavy tasks in the morning for better focus."
                        </p>
                    </div>
                </div>

                <Button size="sm" variant="secondary" className="white-space-nowrap shrink-0">
                    <FaSyncAlt className="mr-2" /> Refresh
                </Button>
            </div>
        </div>
    );
};
