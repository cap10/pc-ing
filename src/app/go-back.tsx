import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({
                        text = 'Back',
                        onClick,
                        className = '',
                        iconSize = '1rem',
                        iconColor = 'currentColor'
                    }) => {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
        group relative inline-flex items-center 
        px-4 py-2.5 md:px-5 md:py-3
        text-sm md:text-base font-medium
        rounded-lg transition-all duration-300
        bg-cyan-400 text-white
        border border-gray-200
        hover:bg-cyan-100 hover:text-gray-900
        hover:shadow-sm hover:border-gray-300
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        ${className}
      `}
        >
            {/* Animated arrow icon */}
            <FaArrowLeft
                className={`mr-2 transition-transform duration-300 group-hover:-translate-x-1`}
                size={iconSize}
                color={iconColor}
            />

            {text}

            {/* Optional hover effect underline */}
            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-3/4"></span>
        </button>
    );
};

export default BackButton;