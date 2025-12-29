import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../../context/HabitContext';
import { format, startOfWeek, addDays } from 'date-fns';
import { FaTrash, FaEllipsisV, FaEdit, FaFire, FaClipboardList, FaMagic, FaUndo } from 'react-icons/fa';
import { clsx } from 'clsx';
import { type Habit } from '../../services/habitService';
import { CreateHabitModal } from './CreateHabitModal';
import toast from 'react-hot-toast';
import { getHabitIcon } from '../../utils/habitIcons';

interface HabitItemProps {
    habit: Habit;
    onToggle: (habit: Habit, dateStr?: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
    onHabitClick?: (habit: Habit) => void;
}

const HabitItem = ({ habit, onToggle, onDelete, onEdit, onHabitClick }: HabitItemProps) => {
    // Current date logic
    const today = new Date();
    const formattedToday = format(today, 'yyyy-MM-dd');
    const isCompletedToday = habit.completedDates.includes(formattedToday);

    // Week logic: Start from Monday
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [isGlowing, setIsGlowing] = useState(false);
    const [glowTimeout, setGlowTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this habit?')) {
            onDelete(habit.id!);
            toast.success('Habit deleted successfully!');
        }
        setShowMenu(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(habit);
        setShowMenu(false);
    };

    const handleCardClick = () => {
        if (onHabitClick) {
            onHabitClick(habit);
        } else {
            navigate(`/habits/${habit.id}`);
        }
    };

    const handleCircleClick = (e: React.MouseEvent, dateStr: string) => {
        e.stopPropagation();

        // Trigger Click Glow
        if (glowTimeout) clearTimeout(glowTimeout);
        setIsGlowing(true);
        const timeoutId = setTimeout(() => {
            setIsGlowing(false);
        }, 2000);
        setGlowTimeout(timeoutId);

        // Toggle specific date
        onToggle(habit, dateStr);

        const wasCompleted = habit.completedDates.includes(dateStr);
        if (!wasCompleted) {
            toast.success(<span>Habit completed! Keep it up! <FaFire className="inline text-orange-500" /></span>);
        } else {
            toast(<span>Habit un-completed</span>, { icon: <FaUndo className="text-gray-400" /> });
        }
    };

    const hoverGlow = `${habit.color}4d`; // ~30% alpha for hover
    const clickGlow = `${habit.color}66`; // ~40% alpha for click

    return (
        <div
            className={clsx(
                "group relative flex items-center justify-between py-3 px-4 lg:py-4 lg:px-6 rounded-2xl bg-white/5 hover:bg-white/8 border border-white/10 gap-3 lg:gap-4 mt-3 select-none transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl",
                isCompletedToday && "opacity-90",
                // CLICK GLOW OVERRIDES
                isGlowing && "shadow-[0_0_40px_var(--click-glow)] border-[var(--click-glow)] scale-105 bg-white/10"
            )}
            style={{
                '--habit-color': habit.color,
                '--habit-glow': hoverGlow,
                '--click-glow': clickGlow
            } as React.CSSProperties}
            onClick={handleCardClick}
        >
            <div className={clsx(
                // Base layout classes
                "absolute inset-0 rounded-2xl border transition-all duration-500 pointer-events-none",
                "border-transparent group-hover:border-[var(--habit-glow)]",
                "group-hover:shadow-[0_0_30px_var(--habit-glow)]"
            )} />

            {/* CONTENT Z-INDEX wrapper to sit above the hover-border div if needed,
                but actually the border div is pointer-events-none so it's fine overlaying or underlaying.
                Let's just apply the hover effects to the PARENT directly for simplicity if possible.
                Tailwind arbitrary values with variables work: hover:border-[var(--habit-glow)]
            */}
            {/* <style>{`
                .group:hover {
                    border-color: var(--habit-glow) !important;
                    box-shadow: 0 0 30px var(--habit-glow) !important;
                }
            `}</style> */}

            {/* LEFT: Icon + Text (Responsive sizes) */}
            <div className="flex items-center gap-2.5 lg:gap-4 flex-1 min-w-0 z-10">
                <div
                    className={clsx(
                        "w-10 h-10 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center border-2 p-1.5 lg:p-3 shrink-0 transition-all duration-700 ease-out hover:scale-110 hover:rotate-12",
                        isCompletedToday && "animate-spin-smooth scale-105"
                    )}
                    style={{
                        backgroundColor: isCompletedToday ? `${habit.color}33` : `${habit.color}1a`,
                        borderColor: `${habit.color}66`,
                        boxShadow: isCompletedToday ? `0 0 15px ${habit.color}4d` : 'none'
                    }}
                >
                    <div
                        className={clsx("text-lg lg:text-3xl transition-all duration-500")}
                        style={{ color: habit.color }}
                    >
                        {getHabitIcon(habit.icon) || habit.icon || <FaClipboardList />}
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <h3
                        className={clsx(
                            "font-semibold text-sm lg:text-lg truncate leading-tight transition-all duration-500 ease-out",
                            isCompletedToday ? "line-through text-gray-500 decoration-auto" : "text-white"
                        )}
                        style={{ textDecorationColor: isCompletedToday ? habit.color : 'transparent' }}
                    >
                        {habit.name}
                    </h3>
                    <p className="text-gray-400 text-xs lg:text-sm font-medium transition-opacity duration-300">Daily</p>
                </div>
            </div>

            {/* RIGHT: STREAK SECTION - CLICKABLE & INTERACTIVE */}
            <div className="flex items-center gap-1 lg:gap-2 shrink-0 ml-1 transition-all duration-300 group-hover:gap-1.5 z-10">
                <span className="text-xs lg:text-sm font-semibold text-gray-400 tracking-wider uppercase whitespace-nowrap transition-opacity duration-300">STRK</span>

                {/* FIRE ICON - ALWAYS ORANGE */}
                <FaFire
                    className={clsx(
                        "w-3.5 h-3.5 lg:w-5 lg:h-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                        habit.streak > 0
                            ? "text-orange-400 animate-fireFlicker drop-shadow-sm"
                            : "text-gray-400"
                    )}
                />

                {/* 7 CLICKABLE CIRCLES - MON-SUN LOGIC */}
                <div className="flex -space-x-0.5 lg:-space-x-1">
                    {Array(7).fill(0).map((_, i) => {
                        // Calculate specific date for this dot (Monday-based index)
                        const dotDate = addDays(startOfCurrentWeek, i);
                        const dotDateStr = format(dotDate, 'yyyy-MM-dd');

                        const isCompleted = habit.completedDates.includes(dotDateStr);

                        return (
                            <button
                                key={i}
                                onClick={(e) => handleCircleClick(e, dotDateStr)}
                                className={clsx(
                                    "w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full border-2 shadow-sm transition-all duration-300 hover:scale-125 hover:shadow-lg active:scale-110 flex items-center justify-center",
                                    isCompleted
                                        ? "bg-emerald-400 border-emerald-400/50 shadow-emerald-500/25 scale-110"
                                        : "bg-gray-600/40 border-gray-500/30 hover:bg-white/20"
                                )}
                                title={format(dotDate, 'EEE, MMM d')}
                            >
                                {/* No checkmark needed, color indicates state */}
                            </button>
                        );
                    })}
                </div>

                <span className="text-sm lg:text-base font-bold text-white ml-1 lg:ml-2 min-w-[20px] text-center transition-all duration-300 group-hover:text-orange-300">
                    {habit.streak}
                </span>

                {/* Menu Trigger */}
                <div className="relative ml-0.5 lg:ml-1" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <FaEllipsisV size={12} />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-[#1e1e2e] border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={handleEdit} className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/10 flex items-center gap-3 border-b border-white/5"><FaEdit size={14} className="text-blue-400" /> Edit</button>
                            <button onClick={handleDelete} className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3"><FaTrash size={14} /> Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const HabitList = ({ filterCategory = 'All', onHabitClick }: { filterCategory?: string, onHabitClick?: (habit: Habit) => void }) => {
    const { loading, toggleHabit, removeHabit, getHabitsByDate } = useHabits();
    const allTodaysHabits = getHabitsByDate(new Date());

    // Filter by category
    const todaysHabits = filterCategory === 'All'
        ? allTodaysHabits
        : allTodaysHabits.filter(h => h.category === filterCategory);

    // Edit Modal State
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEdit = (habit: Habit) => {
        setEditingHabit(habit);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingHabit(null);
    };

    if (loading) return <div className="text-center text-muted py-10">Loading habits...</div>;

    if (todaysHabits.length === 0) {
        return (
            <div className="text-center py-10 glass-card border-dashed border-2 border-border">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-primary">
                    <FaMagic />
                </div>
                <h3 className="text-xl font-bold mb-2">No habits for today</h3>
                <p className="text-muted">Create your first habit to start your journey!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* PAGE LOAD: Fire first, then staggered rows */}
            {/* HABIT ROWS - STAGGERED ANIMATION */}

            {/* HABIT ROWS - STAGGERED ANIMATION */}
            {todaysHabits.map((habit, index) => (
                <div
                    key={habit.id}
                    className={clsx(
                        "opacity-0 translate-y-8 animate-slideUpFadeIn",
                    )}
                    style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'forwards' }}
                >
                    <HabitItem
                        habit={habit}
                        onToggle={toggleHabit}
                        onDelete={removeHabit}
                        onEdit={handleEdit}
                        onHabitClick={onHabitClick}
                    />
                </div>
            ))}

            {/* Reusing the Create Modal for Editing */}
            {editingHabit && (
                <CreateHabitModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    habitToEdit={editingHabit}
                />
            )}
        </div>
    );
};
