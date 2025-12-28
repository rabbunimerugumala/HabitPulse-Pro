import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { type Habit, fetchHabits, createHabit, updateHabit, toggleHabitCompletion, deleteHabit } from '../services/habitService';
import { format } from 'date-fns';

interface HabitContextType {
    habits: Habit[];
    loading: boolean;
    addHabit: (habit: any) => Promise<any>;
    toggleHabit: (habit: Habit, date?: string) => Promise<void>;
    removeHabit: (id: string) => Promise<void>;
    editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
    getHabitsByDate: (date: Date) => Habit[];
    isAddModalOpen: boolean;
    openAddModal: () => void;
    closeAddModal: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const loadHabits = async () => {
        if (!user) return;
        try {
            const data = await fetchHabits(user.id);
            // console.log("Fetched habits:", data); // Removed per user request
            setHabits(data);
        } catch (error) {
            console.error("Error fetching habits:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            setHabits([]);
            setLoading(false);
            return;
        }
        loadHabits();
    }, [user?.id]); // Only refetch if user ID changes, ignoring other metadata updates

    const addHabit = async (habitData: any) => {
        if (!user) return;
        const newHabit = await createHabit({ ...habitData, user_id: user.id });
        await loadHabits(); // Refresh list
        return newHabit;
    };

    const toggleHabit = async (habit: Habit, dateStr = format(new Date(), 'yyyy-MM-dd')) => {
        await toggleHabitCompletion(habit, dateStr);
        await loadHabits(); // Refresh list to get updated streak/completions
    };

    const removeHabit = async (id: string) => {
        await deleteHabit(id);
        await loadHabits();
    };

    const editHabit = async (id: string, updates: Partial<Habit>) => {
        await updateHabit(id, updates);
        await loadHabits();
    };

    const getHabitsByDate = (date: Date) => {
        // Filter habits that should be done on this date based on data
        // For MVP we just show all active habits, but you'd filter by frequency here
        const dayName = format(date, 'EEE'); // Mon, Tue...
        return habits.filter(h => {
            if (h.frequency.type === 'daily') return true;
            if (h.frequency.type === 'weekly' || h.frequency.type === 'custom') {
                // Return true if days include today OR if days is empty (fallback for MVP)
                return h.frequency.days?.includes(dayName) || (h.frequency.days?.length === 0);
            }
            return true;
        });
    };

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const value = {
        habits,
        loading,
        addHabit,
        toggleHabit,
        removeHabit,
        editHabit,
        getHabitsByDate,
        isAddModalOpen,
        openAddModal,
        closeAddModal
    };

    return (
        <HabitContext.Provider value={value}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (context === undefined) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
};
