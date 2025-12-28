import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HabitList } from '../components/habits/HabitList';
import { CreateHabitModal } from '../components/habits/CreateHabitModal';
import { Button } from '../components/ui/Button';
import { FaPlus } from 'react-icons/fa';

export const Habits = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AppLayout>
            <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Habits</h1>
                        <p className="text-gray-400">Manage and track your daily routines.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <FaPlus className="mr-2" /> New Habit
                    </Button>
                </div>

                <HabitList />

                <CreateHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </AppLayout>
    );
};
