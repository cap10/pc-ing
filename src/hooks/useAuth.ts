import { useAppSelector } from '../store/hooks';

export const useAuth = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isAdmin = user?.role === 'ADMIN';
    const canEdit = isSuperAdmin; // Only SUPER_ADMIN can edit
    const canView = isAuthenticated; // Both roles can view
    
    return {
        user,
        isAuthenticated,
        isSuperAdmin,
        isAdmin,
        canEdit,
        canView,
    };
};