import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
    fallbackPath?: string;
    label?: string;
    className?: string;
}

export const BackButton = ({ fallbackPath = '/dashboard', label = 'Back', className = '' }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(fallbackPath);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-medium text-white hover:bg-white/20 transition-all active:scale-95 ${className}`}
        >
            <FaArrowLeft size={16} />
            <span>{label}</span>
        </button>
    );
};
