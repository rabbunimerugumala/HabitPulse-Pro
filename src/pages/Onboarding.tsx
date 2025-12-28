import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../config/supabaseClient';
import { FaBullseye, FaChartLine, FaCheck, FaLeaf, FaMedal } from 'react-icons/fa';
import { clsx } from 'clsx';

const STEPS = [
    { title: 'Profile Setup', description: 'Tell us a bit about yourself' },
    { title: 'Focus Areas', description: 'What do you want to improve?' },
    { title: 'Goal Setting', description: 'Set your initial targets' }
];

const FOCUS_AREAS = [
    { id: 'health', label: 'Health & Fitness', icon: FaLeaf },
    { id: 'productivity', label: 'Productivity', icon: FaChartLine },
    { id: 'mindfulness', label: 'Mindfulness', icon: FaBullseye },
    { id: 'skills', label: 'Skill Building', icon: FaMedal },
];

const EXPERIENCE_LEVELS = [
    { id: 'beginner', label: 'Beginner', desc: 'I want to build my first consistent habit.' },
    { id: 'intermediate', label: 'Intermediate', desc: 'I have some habits but want more consistency.' },
    { id: 'advanced', label: 'Advanced', desc: 'I want to optimize my routine and stack habits.' },
];

export const Onboarding = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        displayName: user?.user_metadata?.name || '',
        ageGroup: '',
        focusAreas: [] as string[],
        experienceLevel: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleFocusArea = (areaId: string) => {
        setFormData(prev => {
            const currentFocusAreas = prev.focusAreas;
            if (currentFocusAreas.includes(areaId)) {
                return { ...prev, focusAreas: currentFocusAreas.filter(a => a !== areaId) };
            } else {
                return { ...prev, focusAreas: [...currentFocusAreas, areaId] };
            }
        });
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: formData.displayName,
                    age_group: formData.ageGroup,
                    focus_areas: JSON.stringify(formData.focusAreas),
                    experience_level: formData.experienceLevel,
                    onboarding_completed: true
                })
                .eq('id', user.id);

            if (error) throw error;
            navigate('/');
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            handleFinish();
        }
    };

    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header / Progress */}
            <header className="p-6">
                <div className="max-w-xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-gray-400">Step {step + 1} of {STEPS.length}</span>
                        <div className="flex gap-2">
                            {STEPS.map((_, i) => (
                                <div key={i} className={clsx("w-2 h-2 rounded-full transition-colors", i <= step ? "bg-neon-blue" : "bg-white/10")} />
                            ))}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{STEPS[step].title}</h1>
                    <p className="text-gray-400">{STEPS[step].description}</p>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 flex items-center justify-center">
                <div className="w-full max-w-xl glass-card p-8 animate-in fade-in slide-in-from-bottom-4">
                    {/* Step 0: Profile */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <Input
                                label="Display Name"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleInputChange}
                                placeholder="How should we call you?"
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-300">Age Group</label>
                                <select
                                    name="ageGroup"
                                    value={formData.ageGroup}
                                    onChange={handleInputChange}
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50"
                                >
                                    <option value="">Select Age Group</option>
                                    <option value="18-24">18-24</option>
                                    <option value="25-34">25-34</option>
                                    <option value="35-44">35-44</option>
                                    <option value="45+">45+</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Focus Areas */}
                    {step === 1 && (
                        <div className="grid grid-cols-2 gap-4">
                            {FOCUS_AREAS.map(area => (
                                <button
                                    key={area.id}
                                    onClick={() => toggleFocusArea(area.id)}
                                    className={clsx(
                                        "p-4 rounded-xl border transition-all text-left flex flex-col gap-2",
                                        formData.focusAreas.includes(area.id)
                                            ? "bg-neon-blue/10 border-neon-blue text-white"
                                            : "bg-surface/30 border-white/5 text-gray-400 hover:bg-white/5"
                                    )}
                                >
                                    <area.icon className={clsx("text-2xl", formData.focusAreas.includes(area.id) ? "text-neon-blue" : "text-gray-500")} />
                                    <span className="font-medium">{area.label}</span>
                                    {formData.focusAreas.includes(area.id) && <FaCheck className="absolute top-4 right-4 text-neon-blue" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Goal / Experience */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-lg font-medium">What is your experience with habit tracking?</p>
                            {EXPERIENCE_LEVELS.map(level => (
                                <button
                                    key={level.id}
                                    onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.id }))}
                                    className={clsx(
                                        "w-full p-4 rounded-xl border text-left capitalize transition-all",
                                        formData.experienceLevel === level.id
                                            ? "bg-neon-purple/10 border-neon-purple text-white"
                                            : "bg-surface/30 border-white/5 text-gray-400 hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <h3 className={clsx("font-semibold", formData.experienceLevel === level.id ? "text-white" : "text-gray-300")}>
                                                {level.label}
                                            </h3>
                                            <p className="text-sm text-gray-500">{level.desc}</p>
                                        </div>
                                        {formData.experienceLevel === level.id && (
                                            <div className="w-6 h-6 bg-neon-purple rounded-full flex items-center justify-center text-xs">
                                                <FaCheck />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end gap-3">
                        {step > 0 && <Button variant="secondary" onClick={prevStep}>Back</Button>}
                        <Button onClick={handleNext} disabled={loading} className="w-full sm:w-auto">
                            {loading ? 'Setting up...' : step === STEPS.length - 1 ? 'Finish Setup' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};
