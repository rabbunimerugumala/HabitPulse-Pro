import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { CreateHabitModal } from '../habits/CreateHabitModal';
import { useHabits } from '../../context/HabitContext';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAddModalOpen, openAddModal, closeAddModal } = useHabits();

    return (
        <div className="flex min-h-screen bg-background text-white">
            <Sidebar />
            <main className="flex-1 w-full pb-32 lg:pb-0 relative overflow-y-auto">
                <div className="max-w-6xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
            <BottomNav onAddClick={openAddModal} />

            <CreateHabitModal isOpen={isAddModalOpen} onClose={closeAddModal} />
        </div>
    );
};
