import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../../context/HabitContext';
import { format } from 'date-fns';
import { FaCheckCircle, FaTrash, FaEllipsisV, FaEdit } from 'react-icons/fa';
import { clsx } from 'clsx';
import { type Habit } from '../../services/habitService';
import { CreateHabitModal } from './CreateHabitModal';
import toast from 'react-hot-toast';

interface HabitItemProps {
    habit: Habit;
    onToggle: (habit: Habit) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
    onHabitClick?: (habit: Habit) => void;
}

const HabitItem = ({ habit, onToggle, onDelete, onEdit, onHabitClick }: HabitItemProps) => {
    const isCompleted = habit.completedDates.includes(format(new Date(), 'yyyy-MM-dd'));
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(habit);
        // Toast handled by logic? Or here? Let's add here for feedback
        if (!isCompleted) {
            toast.success('Habit completed! Keep it up! 🔥');
        } else {
            toast('Habit un-completed', { icon: '↩️' });
        }
    };

    const handleCardClick = () => {
        if (onHabitClick) {
            onHabitClick(habit);
        } else {
            navigate(`/habits/${habit.id}`);
        }
    };

    return (
        <div
            className={clsx(
                "glass p-4 rounded-xl border-l-4 flex items-center justify-between group cursor-pointer transition-all duration-300 relative select-none",
                isCompleted ? "opacity-70 grayscale-[0.3]" : "hover:bg-white/5",
                "border-neon-blue",
                showMenu ? "z-50" : "z-0" // Elevate card when menu is open to prevent clipping
            )}
            onClick={handleCardClick}
        >
            <div className="flex items-center gap-4">
                <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-500",
                    isCompleted ? "bg-neon-green/20 text-neon-green rotate-12 scale-110" : "bg-white/5 text-gray-300"
                )}>
                    {habit.icon || '📝'}
                </div>
                <div>
                    <h3 className={clsx(
                        "font-semibold text-lg transition-all",
                        isCompleted && "line-through text-gray-400"
                    )}>
                        {habit.name}
                    </h3>
                    <p className="text-sm text-gray-500">{habit.category} • {habit.frequency.type}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Streak</p>
                    <p className={clsx("font-bold", habit.streak > 0 ? "text-neon-orange" : "text-gray-600")}>
                        🔥 {habit.streak}
                    </p>
                </div>

                {/* Actions Container */}
                <div className="flex items-center gap-2">
                    {/* Toggle Button (Desktop) */}
                    <button
                        className={clsx(
                            "hidden sm:flex w-10 h-10 rounded-full border-2 items-center justify-center transition-all duration-300",
                            isCompleted
                                ? "border-neon-green bg-neon-green text-surface scale-110"
                                : "border-white/20 text-transparent group-hover:border-neon-green group-hover:text-neon-green/50"
                        )}
                        onClick={handleToggle}
                        title={isCompleted ? "Unmark" : "Mark Complete"}
                    >
                        <FaCheckCircle className={clsx("transition-all", isCompleted ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                    </button>

                    {/* Menu Trigger */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <FaEllipsisV />
                        </button>

                        {/* Dropdown Menu - Fixed positioning and visibility */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-[#1e1e2e] border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                {/* Mobile Toggle Option */}
                                <button
                                    onClick={handleToggle}
                                    className="sm:hidden w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/10 border-b border-white/5 flex items-center gap-3 transition-colors"
                                >
                                    <FaCheckCircle className={isCompleted ? "text-neon-green" : "text-gray-400"} />
                                    {isCompleted ? 'Mark Undone' : 'Mark Done'}
                                </button>

                                <button
                                    onClick={handleEdit}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/10 flex items-center gap-3 transition-colors border-b border-white/5"
                                >
                                    <FaEdit size={14} className="text-blue-400" /> Edit
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors"
                                >
                                    <FaTrash size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
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

    if (loading) return <div className="text-center text-gray-500 py-10">Loading habits...</div>;

    if (todaysHabits.length === 0) {
        return (
            <div className="text-center py-10 glass rounded-2xl border-dashed border-2 border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-gray-600">
                    ✨
                </div>
                <h3 className="text-xl font-bold mb-2">No habits for today</h3>
                <p className="text-gray-400">Create your first habit to start your journey!</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                {todaysHabits.map((habit) => (
                    <HabitItem
                        key={habit.id}
                        habit={habit}
                        onToggle={toggleHabit}
                        onDelete={removeHabit}
                        onEdit={handleEdit}
                        onHabitClick={onHabitClick}
                    />
                ))}
            </div>

            {/* Reusing the Create Modal for Editing */}
            {editingHabit && (
                <CreateHabitModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    habitToEdit={editingHabit}
                />
            )}
        </>
    );
};
