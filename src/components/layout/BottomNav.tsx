import { NavLink } from 'react-router-dom';
import { FaHome, FaList, FaChartBar, FaCog, FaPlus } from 'react-icons/fa';
import { clsx } from 'clsx';

const NAV_ITEMS = [
    { icon: FaHome, label: 'Home', path: '/' },
    { icon: FaList, label: 'Habits', path: '/habits' },
    // Middle: Add Button
    { icon: FaChartBar, label: 'Analytics', path: '/analytics' },
    { icon: FaCog, label: 'Settings', path: '/settings' },
];

interface BottomNavProps {
    onAddClick: () => void;
}

export const BottomNav = ({ onAddClick }: BottomNavProps) => {
    return (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
            <nav className="glass bg-[#16161e]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-16 relative flex items-center px-2">

                {/* Left Group */}
                <div className="flex-1 flex justify-around items-center mr-8">
                    {NAV_ITEMS.slice(0, 2).map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}
                </div>

                {/* Floating Add Button - Center */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                    <button
                        onClick={onAddClick}
                        className="w-14 h-14 rounded-full bg-neon-blue shadow-[0_0_20px_#3B82F6] flex items-center justify-center text-white text-xl hover:scale-110 active:scale-95 transition-all border-4 border-[#0f0f13]"
                        aria-label="Add Habit"
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Right Group */}
                <div className="flex-1 flex justify-around items-center ml-8">
                    {NAV_ITEMS.slice(2).map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}
                </div>

            </nav>
        </div>
    );
};

const NavItem = ({ item }: { item: any }) => (
    <NavLink
        to={item.path}
        className={({ isActive }) => clsx(
            "flex-1 flex flex-col items-center justify-end pb-2 gap-1 h-full transition-all relative",
            isActive ? "text-neon-blue" : "text-gray-500 hover:text-gray-300"
        )}
    >
        {({ isActive }) => (
            <>
                <item.icon className={clsx("text-2xl transition-transform", isActive && "scale-110")} />
                {isActive && (
                    <div className="w-5 h-1 bg-neon-blue shadow-[0_0_10px_#3B82F6] rounded-full mt-1" />
                )}
            </>
        )}
    </NavLink>
);
