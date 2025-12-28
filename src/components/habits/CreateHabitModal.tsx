import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useHabits } from '../../context/HabitContext';
import { FaTimes } from 'react-icons/fa';
import { clsx } from 'clsx';
import { createPortal } from 'react-dom';
import { type Habit } from '../../services/habitService';

interface CreateHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    habitToEdit?: Habit | null;
}

const CATEGORIES = ["Health", "Productivity", "Learning", "Mindfulness", "Relationships", "Finance", "Custom"];
const ICONS = ["🧘‍♀️", "💧", "🏃‍♂️", "📚", "💊", "💰", "🎨", "💤"];
const COLORS = ["#3B82F6", "#A855F7", "#EC4899", "#10B981", "#F97316"];

export const CreateHabitModal = ({ isOpen, onClose, habitToEdit }: CreateHabitModalProps) => {
    const { addHabit, editHabit } = useHabits();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [name, setName] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [icon, setIcon] = useState(ICONS[0]);
    const [color, setColor] = useState(COLORS[0]);
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
    // We could add days/reminders here if we expand the UI

    // Load initial data when editing
    useEffect(() => {
        if (habitToEdit) {
            setName(habitToEdit.name);
            setCategory(habitToEdit.category);
            setIcon(habitToEdit.icon);
            setColor(habitToEdit.color);
            setFrequency(habitToEdit.frequency.type);
        } else {
            // Reset if creating new
            setName('');
            setCategory(CATEGORIES[0]);
            setIcon(ICONS[0]);
            setColor(COLORS[0]);
            setFrequency('daily');
        }
        setStep(1);
    }, [habitToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const habitData = {
                name,
                category,
                icon,
                color,
                frequency: { type: frequency, days: [] }, // simplified for MVP
                reminder: { enabled: false, time: "09:00" },
            };

            if (habitToEdit && habitToEdit.id) {
                await editHabit(habitToEdit.id, habitData);
            } else {
                await addHabit(habitData);
            }

            onClose();
            // Reset form
            if (!habitToEdit) setName('');
            setStep(1);
        } catch (e: any) {
            console.error(e);
            alert(`Failed to save habit: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg glass-card p-6 md:p-8 animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <FaTimes />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
                </h2>

                {step === 1 && (
                    <div className="space-y-6">
                        <Input
                            label="Habit Name"
                            placeholder="e.g. Morning Yoga"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-lg text-sm transition-colors",
                                            category === cat ? "bg-neon-blue text-white" : "bg-surface border border-white/10 text-gray-400 hover:bg-white/5"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {ICONS.map(ic => (
                                    <button
                                        key={ic}
                                        onClick={() => setIcon(ic)}
                                        className={clsx(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all",
                                            icon === ic ? "bg-white/10 border-2 border-neon-blue scale-110" : "bg-surface border border-white/10 opacity-60"
                                        )}
                                    >
                                        {ic}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button onClick={() => setStep(2)} disabled={!name} className="w-full">Next: Details</Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['daily', 'weekly', 'custom'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFrequency(f as 'daily' | 'weekly' | 'custom')}
                                        className={clsx(
                                            "py-3 rounded-xl border capitalise transition-colors",
                                            frequency === f ? "border-neon-blue bg-neon-blue/10 text-neon-blue" : "border-white/10 bg-surface/50 text-gray-400"
                                        )}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                            <div className="flex gap-3">
                                {COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={clsx(
                                            "w-8 h-8 rounded-full border-2 transition-transform",
                                            color === c ? "border-white scale-110 shadow-[0_0_10px_currentColor]" : "border-transparent"
                                        )}
                                        style={{ backgroundColor: c, color: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                            <Button onClick={handleSubmit} className="flex-1" isLoading={loading}>
                                {habitToEdit ? 'Save Changes' : 'Create Habit'}
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>,
        document.body
    );
};
