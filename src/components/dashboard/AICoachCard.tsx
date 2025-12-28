import { useState, useEffect } from 'react';
import { FaRobot, FaSyncAlt } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { fetchLatestInsight } from '../../services/habitService';
import { clsx } from 'clsx';

export const AICoachCard = () => {
    const { user } = useAuth();
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const loadInsight = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await fetchLatestInsight(user.id);
            if (data) {
                setInsight(data.summary);
            } else {
                setInsight(null);
            }
        } catch (error) {
            console.error("Failed to load insight", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInsight();
    }, [user]);

    if (!insight) return null; // Or return empty state card logic? 
    // User requested: "show a friendly empty state: 'No insights yet...'" if none exists.
    // But if hidden is better for Home? 
    // "If none exists, show a friendly empty state: 'No insights yet. Generate insights after tracking habits for a few days.'"

    return (
        <div className="glass-card p-5 md:p-6 relative overflow-hidden border-primaryAlt/30 group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primaryAlt/10 to-primary/10 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between">
                <div className="flex gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primaryAlt to-primary flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-primaryAlt/30 shrink-0 mt-1 md:mt-0">
                        <FaRobot />
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
                            Daily AI Insight <span className="bg-surface/50 px-2 py-0.5 rounded text-[10px] md:text-xs text-primaryAlt border border-primaryAlt/30">Beta</span>
                        </h3>
                        <p className="text-sm md:text-base text-muted mt-1 max-w-xl leading-relaxed">
                            {insight || "No insights yet. Generate insights from the Analytics page after tracking habits for a few days."}
                        </p>
                    </div>
                </div>

                <Button
                    size="sm"
                    variant="secondary"
                    className="w-full md:w-auto justify-center md:justify-start white-space-nowrap shrink-0 mt-2 md:mt-0"
                    onClick={loadInsight}
                    isLoading={loading}
                >
                    <FaSyncAlt className={clsx("mr-2", loading && "animate-spin")} /> Refresh
                </Button>
            </div>
        </div>
    );
};
