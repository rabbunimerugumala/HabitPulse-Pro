import { NavLink } from 'react-router-dom';
import { FaHome, FaList, FaChartBar, FaCog, FaPlus } from 'react-icons/fa';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
    { icon: FaHome, label: 'Home', path: '/' },
    { icon: FaList, label: 'Habits', path: '/habits' },
    // Middle: Add Button placeholder
    { icon: FaChartBar, label: 'Analytics', path: '/analytics' },
    { icon: FaCog, label: 'Settings', path: '/settings' },
];

interface BottomNavProps {
    onAddClick: () => void;
}

export const BottomNav = ({ onAddClick }: BottomNavProps) => {
    const [showTooltip, setShowTooltip] = useState(() => {
        return !sessionStorage.getItem('hasShownNavTooltip');
    });

    useEffect(() => {
        if (!showTooltip) return;

        const timer = setTimeout(() => {
            setShowTooltip(false);
            sessionStorage.setItem('hasShownNavTooltip', 'true');
        }, 1500);

        return () => clearTimeout(timer);
    }, [showTooltip]);

    return (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
            <nav className="glass bg-black/30 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-16 grid grid-cols-5 items-center px-2 relative transition-all duration-300">

                {/* Home */}
                <NavItem item={NAV_ITEMS[0]} />

                {/* Habits */}
                <NavItem item={NAV_ITEMS[1]} />

                {/* Add Button - Inline Center */}
                <div className="relative flex flex-col items-center justify-center">
                    {/* Tooltip */}
                    <div
                        className={clsx(
                            "absolute bottom-full mb-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap transition-all duration-500 pointer-events-none",
                            showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        )}
                    >
                        Add Habit
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary" />
                    </div>

                    <button
                        onClick={onAddClick}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primaryAlt shadow-lg shadow-primary/30 flex items-center justify-center text-white text-lg hover:scale-110 active:scale-95 transition-all border border-white/20"
                        aria-label="Add Habit"
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Analytics */}
                <NavItem item={NAV_ITEMS[2]} />

                {/* Settings */}
                <NavItem item={NAV_ITEMS[3]} />

            </nav>
        </div>
    );
};

const NavItem = ({ item }: { item: any }) => (
    <NavLink
        to={item.path}
        className={({ isActive }) => clsx(
            "flex flex-col items-center justify-center h-full w-full transition-all duration-300",
            isActive ? "text-primary" : "text-gray-500 hover:text-gray-300"
        )}
    >
        {({ isActive }) => (
            <div className="flex flex-col items-center gap-1 relative">
                <item.icon className={clsx("text-xl transition-all duration-300", isActive && "scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]")} />
                {isActive && (
                    <span className="w-1 h-1 bg-primary rounded-full absolute -bottom-2 shadow-[0_0_4px_#3B82F6]" />
                )}
            </div>
        )}
    </NavLink>
);
