import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../../context/HabitContext';
import { format } from 'date-fns';
import { FaCheckCircle, FaTrash, FaEllipsisV, FaEdit, FaFire, FaClipboardList, FaMagic, FaUndo } from 'react-icons/fa';
import { clsx } from 'clsx';
import { type Habit } from '../../services/habitService';
import { CreateHabitModal } from './CreateHabitModal';
import toast from 'react-hot-toast';
import { getHabitIcon } from '../../utils/habitIcons';

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

    // Local state for the intermediate "marked" (check) step
    const [isMarked, setIsMarked] = useState(false);

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
        if (!isCompleted) {
            toast.success(<span>Habit completed! Keep it up! <FaFire className="inline text-orange-500" /></span>);
        } else {
            toast(<span>Habit un-completed</span>, { icon: <FaUndo className="text-gray-400" /> });
        }
    };

    const handleCardClick = () => {
        if (onHabitClick) {
            onHabitClick(habit);
        } else {
            navigate(`/habits/${habit.id}`);
        }
    };

    const handleCircleClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation(); // Ensure we don't trigger the card click

        // Logic: specific dot interaction
        // If clicking the immediate next dot (current streak index)
        if (index === habit.streak) {
            if (!isMarked) {
                setIsMarked(true); // Step 1: Show check
            } else {
                handleToggle(e); // Step 2: Complete (Green)
                setIsMarked(false); // Reset local mark
            }
        }
        // If clicking the current "Today" dot (last completed) to undo
        else if (index === habit.streak - 1 && isCompleted) {
            handleToggle(e); // Undo
        }
    };

    return (
        <div
            className={clsx(
                "flex items-center justify-between py-3 px-4 lg:py-4 lg:px-6 rounded-2xl bg-white/5 hover:bg-white/8 border border-white/10 gap-3 lg:gap-4 mt-3 select-none transition-all duration-200",
                isCompleted && "opacity-80"
            )}
            onClick={handleCardClick}
        >
            {/* LEFT: Icon + Text (Responsive sizes) */}
            <div className="flex items-center gap-2.5 lg:gap-4 flex-1 min-w-0">
                <div
                    className={clsx(
                        "w-10 h-10 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center border-2 p-1.5 lg:p-3 shrink-0 transition-all duration-500",
                        isCompleted ? "scale-105 rotate-6" : "hover:scale-105" // "Small move" animation
                    )}
                    style={{
                        backgroundColor: isCompleted ? `${habit.color}33` : `${habit.color}1a`, // Hex alpha: ~20% / ~10%
                        borderColor: `${habit.color}66`, // ~40%
                        boxShadow: isCompleted ? `0 0 15px ${habit.color}4d` : 'none' // ~30%
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
                            "font-semibold text-sm lg:text-lg truncate leading-tight transition-all duration-300",
                            isCompleted ? "line-through text-gray-500 decoration-auto" : "text-white"
                        )}
                        style={{ textDecorationColor: isCompleted ? habit.color : 'transparent' }}
                    >
                        {habit.name}
                    </h3>
                    <p className="text-gray-400 text-xs lg:text-sm font-medium">{habit.category} • {habit.frequency.type}</p>
                </div>
            </div>

            {/* RIGHT: STREAK SECTION - CLICKABLE & INTERACTIVE */}
            <div className="flex items-center gap-1 lg:gap-2 shrink-0 ml-1">
                <span className="text-xs lg:text-sm font-semibold text-gray-400 tracking-wider uppercase whitespace-nowrap">STRK</span>

                {/* FIRE ICON - STATE BASED */}
                <FaFire className={clsx(
                    "w-3.5 h-3.5 lg:w-5 lg:h-5 shrink-0 transition-all",
                    habit.streak > 0
                        ? "text-orange-400 animate-fireFlicker drop-shadow-sm"
                        : "text-gray-400"
                )} />

                {/* 7 CLICKABLE CIRCLES */}
                <div className="flex -space-x-0.5 lg:-space-x-1">
                    {Array(7).fill(0).map((_, dayIndex) => {
                        const isDone = dayIndex < habit.streak;
                        const isCheck = dayIndex === habit.streak && isMarked; // Show check on next potential spot if marked

                        return (
                            <button
                                key={dayIndex}
                                onClick={(e) => handleCircleClick(e, dayIndex)}
                                className={clsx(
                                    "w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full border-2 shadow-sm transition-all hover:scale-125 active:scale-110 flex items-center justify-center",
                                    isDone
                                        ? "bg-emerald-400 border-emerald-400/50 shadow-emerald-500/25"
                                        : isCheck
                                            ? "bg-white/20 border-white/40 text-[8px] lg:text-[10px] text-gray-300" // Small check style
                                            : "bg-gray-600/40 border-gray-500/30"
                                )}
                                disabled={dayIndex > habit.streak} // Disable future dots beyond next step
                            >
                                {isCheck && !isDone && '✓'}
                            </button>
                        );
                    })}
                </div>

                <span className="text-sm lg:text-base font-bold text-white ml-1 lg:ml-2 min-w-[20px] text-center">
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
