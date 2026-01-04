import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useHabits } from '../../context/HabitContext';
import { FaTimes } from 'react-icons/fa';
import { clsx } from 'clsx';
import { createPortal } from 'react-dom';
import { type Habit } from '../../services/habitService';
import { ICON_MAP } from '../../utils/habitIcons';
import ColorPickerDialog from '../ui/ColorPickerDialog';

interface CreateHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    habitToEdit?: Habit | null;
}

const CATEGORIES = ["Health", "Productivity", "Learning", "Mindfulness", "Finance", "Relationships", "Custom"];

// Reverse lookup for UI rendering of options
const ICON_KEYS = Object.keys(ICON_MAP);

const COLORS = [
    "#3B82F6", // Blue
    "#A855F7", // Purple
    "#EC4899", // Pink
    "#10B981", // Green
    "#14b8a6", // Teal
    "#F97316", // Orange
    "#EAB308", // Yellow
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export const CreateHabitModal = ({ isOpen, onClose, habitToEdit }: CreateHabitModalProps) => {
    const { addHabit, editHabit } = useHabits();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [name, setName] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [iconKey, setIconKey] = useState("run"); // Default key
    const [color, setColor] = useState(COLORS[0]);
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
    const [selectedDays, setSelectedDays] = useState<number[]>([]); // 0-6


    // Custom Color Picker Dialog State
    const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
    const [tempColor, setTempColor] = useState(color);

    // Load initial data
    useEffect(() => {
        if (habitToEdit) {
            setName(habitToEdit.name);
            setCategory(habitToEdit.category);
            // If habit has emoji, try to map or default
            setIconKey(ICON_MAP[habitToEdit.icon] ? habitToEdit.icon : "run");

            setColor(habitToEdit.color);
            setFrequency(habitToEdit.frequency.type === 'custom' ? 'weekly' : habitToEdit.frequency.type as 'daily' | 'weekly');
            setSelectedDays(habitToEdit.frequency.days || []);
        } else {
            setName('');
            setCategory(CATEGORIES[0]);
            setIconKey("run");
            setColor(COLORS[0]);
            setFrequency('daily');
            setSelectedDays([]);
        }
        setStep(1);
    }, [habitToEdit, isOpen]);

    // Handle Day Toggle
    const toggleDay = (dayIndex: number) => {
        if (selectedDays.includes(dayIndex)) {
            setSelectedDays(selectedDays.filter(d => d !== dayIndex));
        } else {
            setSelectedDays([...selectedDays, dayIndex].sort());
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const finalDays = frequency === 'daily'
                ? [0, 1, 2, 3, 4, 5, 6]
                : selectedDays;

            const habitData = {
                name,
                category,
                icon: iconKey,
                color,
                frequency: {
                    type: frequency,
                    days: finalDays
                },
                reminder: {
                    enabled: false,
                    time: "09:00"
                },
            };

            if (habitToEdit && habitToEdit.id) {
                await editHabit(habitToEdit.id, habitData);
            } else {
                await addHabit(habitData);
            }

            onClose();
        } catch (e: any) {
            console.error(e);
            alert(`Failed to save habit: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const isStep1Valid = name.trim().length > 0;
    const isStep2Valid = frequency === 'daily' || selectedDays.length > 0;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="relative w-full max-w-md md:max-w-xl glass-card max-h-[90vh] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 md:p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-white transition-colors p-2">
                        <FaTimes />
                    </button>

                    <h2 className="text-xl md:text-2xl font-bold font-heading mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primaryAlt w-fit">
                        {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
                    </h2>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 mb-6 md:mb-8">
                        <div className={clsx("h-1 flex-1 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-white/10")} />
                        <div className={clsx("h-1 flex-1 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-white/10")} />
                    </div>

                    {step === 1 && (
                        <div className="space-y-5 md:space-y-6">
                            <Input
                                label="Habit Name"
                                placeholder="e.g. Morning Meditation"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                            />

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={clsx(
                                                "px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-all",
                                                category === cat
                                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                                    : "bg-white/5 text-muted hover:bg-white/10 hover:text-white border border-white/5"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Icon Picker */}
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">Icon</label>
                                <div className="grid grid-cols-5 md:grid-cols-7 gap-2 md:gap-3">
                                    {ICON_KEYS.map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setIconKey(key)}
                                            className={clsx(
                                                "aspect-square rounded-xl flex items-center justify-center text-lg md:text-xl transition-all border",
                                                iconKey === key
                                                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-110"
                                                    : "bg-surface border-white/5 text-muted hover:border-white/20 hover:text-white"
                                            )}
                                            title={key}
                                        >
                                            {ICON_MAP[key]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 md:pt-4">
                                <Button onClick={() => setStep(2)} disabled={!isStep1Valid} className="w-full py-3 md:py-3.5 text-base">
                                    Next Step
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 md:space-y-8">

                            {/* Frequency Section */}
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <label className="block text-sm font-medium text-muted mb-3">Frequency</label>
                                <div className="flex p-1 bg-black/20 rounded-xl mb-4">
                                    <button
                                        onClick={() => setFrequency('daily')}
                                        className={clsx(
                                            "flex-1 py-2 rounded-lg text-xs md:text-sm font-medium transition-all",
                                            frequency === 'daily' ? "bg-surface text-white shadow-md" : "text-muted hover:text-white"
                                        )}
                                    >
                                        Every Day
                                    </button>
                                    <button
                                        onClick={() => setFrequency('weekly')}
                                        className={clsx(
                                            "flex-1 py-2 rounded-lg text-xs md:text-sm font-medium transition-all",
                                            frequency === 'weekly' ? "bg-surface text-white shadow-md" : "text-muted hover:text-white"
                                        )}
                                    >
                                        Specific Days
                                    </button>
                                </div>

                                {/* Day Picker */}
                                {frequency === 'weekly' && (
                                    <div className="flex justify-between gap-1 md:gap-2 animate-in slide-in-from-top-2">
                                        {WEEKDAYS.map((day, index) => {
                                            const isSelected = selectedDays.includes(index);
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => toggleDay(index)}
                                                    className={clsx(
                                                        "w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-sm font-bold transition-all border",
                                                        isSelected
                                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/25"
                                                            : "bg-transparent border-white/10 text-muted hover:border-white/30"
                                                    )}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Summary */}
                                <p className="text-xs text-muted mt-3 text-center">
                                    {frequency === 'daily'
                                        ? "Repeats every day"
                                        : selectedDays.length > 0
                                            ? `Repeats on ${selectedDays.length} days per week`
                                            : "Select at least one day"
                                    }
                                </p>
                            </div>

                            {/* Color Row - Simplified spacing */}
                            <div>
                                <label className="block text-sm font-medium text-muted mb-3">Color</label>
                                <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                                    {COLORS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setColor(c);
                                            }}
                                            className={clsx(
                                                "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all",
                                                color === c ? "border-white scale-110 shadow-[0_0_12px_currentColor]" : "border-transparent opacity-80 hover:opacity=100 hover:scale-110"
                                            )}
                                            style={{ backgroundColor: c, color: c }}
                                        />
                                    ))}

                                    {/* Custom Color Button */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setTempColor(color);
                                                setIsColorDialogOpen(true);
                                            }}
                                            className={clsx(
                                                "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-dashed flex items-center justify-center transition-all",
                                                !COLORS.includes(color)
                                                    ? "border-white"
                                                    : "border-white/30 text-muted hover:text-white hover:border-white/60"
                                            )}
                                            style={{
                                                backgroundImage: !COLORS.includes(color)
                                                    ? 'none'
                                                    : "linear-gradient(135deg, #EF4444, #F97316, #EAB308, #22C55E, #3B82F6, #A855F7, #EC4899)",
                                                backgroundColor: !COLORS.includes(color) ? color : 'transparent'
                                            }}
                                            title="Custom Color"
                                        >
                                            {/* gradient circle */}
                                        </button>
                                        {/* Color Picker Dialog */}
                                        <ColorPickerDialog
                                            isOpen={isColorDialogOpen}
                                            initialColor={tempColor}
                                            onConfirm={(newColor) => {
                                                setColor(newColor);
                                                setIsColorDialogOpen(false);
                                            }}
                                            onClose={() => setIsColorDialogOpen(false)}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                                <Button variant="secondary" onClick={() => setStep(1)} className="w-full sm:flex-1 py-3">Back</Button>
                                <Button onClick={handleSubmit} className="w-full sm:flex-1 py-3" isLoading={loading} disabled={!isStep2Valid}>
                                    {habitToEdit ? 'Save Changes' : 'Create Habit'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
