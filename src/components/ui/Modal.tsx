import React, { useEffect } from 'react';

interface ModalProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen = true, onClose }) => {
    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Modal Container with backdrop */}
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            >
                <div 
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

// Modal Header Component
export const ModalHeader: React.FC<{ children: React.ReactNode; onClose?: () => void }> = ({ 
    children, 
    onClose 
}) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="text-xl font-semibold text-gray-900">
            {children}
        </div>
        {onClose && (
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
                <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        )}
    </div>
);

// Modal Body Component
export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
    children, 
    className = "" 
}) => (
    <div className={`flex-1 overflow-y-auto px-6 py-4 ${className}`}>
        {children}
    </div>
);

// Modal Footer Component
export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
    children, 
    className = "" 
}) => (
    <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl ${className}`}>
        {children}
    </div>
);

export default Modal;