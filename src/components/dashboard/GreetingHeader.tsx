import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

export const GreetingHeader = () => {
    const { user } = useAuth();
    const firstName = user?.user_metadata?.name?.split(' ')[0] || 'There';
    const today = format(new Date(), 'EEEE, MMMM do');

    return (
        <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
            <p className="text-muted text-sm uppercase tracking-wider font-medium mb-1">{today}</p>
            <h1 className="text-3xl md:text-4xl font-bold font-heading">
                Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primaryAlt">{firstName}</span> 👋
            </h1>
            <p className="text-muted mt-2 text-lg">Ready to crush your goals today?</p>
        </div>
    );
};
