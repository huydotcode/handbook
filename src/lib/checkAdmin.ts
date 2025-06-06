'use server';
import { UserRole } from '@/enums/UserRole';
import { getAuthSession } from '@/lib/auth';

export const checkAdmin = async () => {
    try {
        const session = await getAuthSession();
        if (!session?.user) return false;

        return session.user.role === UserRole.ADMIN;
    } catch (error: any) {
        throw new Error(error.message);
    }

    return false;
};
