import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../config/supabaseClient';
import { FaBullseye, FaChartLine, FaCheck, FaLeaf, FaMedal } from 'react-icons/fa';
import { clsx } from 'clsx';
import { AuthLayout } from '../components/auth/AuthLayout';

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
        <AuthLayout>
            <div className="w-full h-full flex flex-col">
                {/* Header / Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-gray-400">Step {step + 1} of {STEPS.length}</span>
                        <div className="flex gap-2">
                            {STEPS.map((_, i) => (
                                <div key={i} className={clsx("w-2 h-2 rounded-full transition-colors", i <= step ? "bg-neon-blue" : "bg-white/10")} />
                            ))}
                        </div>
                    </div>
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300" key={`title-${step}`}>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{STEPS[step].title}</h1>
                        <p className="text-gray-400 mt-1">{STEPS[step].description}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300" key={step}>
                    {/* Step 0: Profile */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <Input
                                label="Display Name"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleInputChange}
                                placeholder="How should we call you?"
                                className="bg-surface/50 border-white/10 focus:border-neon-blue"
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-300">Age Group</label>
                                <select
                                    name="ageGroup"
                                    value={formData.ageGroup}
                                    onChange={handleInputChange}
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {FOCUS_AREAS.map(area => (
                                <button
                                    key={area.id}
                                    onClick={() => toggleFocusArea(area.id)}
                                    className={clsx(
                                        "p-4 rounded-xl border transition-all text-left flex flex-col gap-2 hover:scale-[1.02]",
                                        formData.focusAreas.includes(area.id)
                                            ? "bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                            : "bg-surface/30 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex justify-between w-full">
                                        <area.icon className={clsx("text-2xl", formData.focusAreas.includes(area.id) ? "text-neon-blue" : "text-gray-500")} />
                                        {formData.focusAreas.includes(area.id) && <FaCheck className="text-neon-blue animate-in zoom-in spin-in-180 duration-300" />}
                                    </div>
                                    <span className="font-medium">{area.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Goal / Experience */}
                    {step === 2 && (
                        <div className="space-y-3">
                            <p className="text-lg font-medium text-white/90">What is your experience with habit tracking?</p>
                            {EXPERIENCE_LEVELS.map(level => (
                                <button
                                    key={level.id}
                                    onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.id }))}
                                    className={clsx(
                                        "w-full p-4 rounded-xl border text-left capitalize transition-all hover:scale-[1.01]",
                                        formData.experienceLevel === level.id
                                            ? "bg-neon-purple/10 border-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                            : "bg-surface/30 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <h3 className={clsx("font-semibold mb-1", formData.experienceLevel === level.id ? "text-white" : "text-gray-300")}>
                                                {level.label}
                                            </h3>
                                            <p className="text-sm text-gray-500">{level.desc}</p>
                                        </div>
                                        {formData.experienceLevel === level.id && (
                                            <div className="w-6 h-6 bg-neon-purple rounded-full flex items-center justify-center text-xs text-white animate-in zoom-in duration-200">
                                                <FaCheck />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-white/5">
                    {step > 0 ? (
                        <Button
                            variant="secondary"
                            onClick={prevStep}
                            className="flex-1 sm:flex-none sm:w-32"
                        >
                            Back
                        </Button>
                    ) : <div />} {/* Spacer */}
                    <Button
                        onClick={handleNext}
                        disabled={loading}
                        className="flex-1 sm:flex-none sm:w-auto min-w-[140px] bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-all shadow-lg shadow-neon-blue/20"
                    >
                        {loading ? 'Setting up...' : step === STEPS.length - 1 ? 'Finish Setup' : 'Continue'}
                    </Button>
                </div>
            </div>
        </AuthLayout>
    );
};
