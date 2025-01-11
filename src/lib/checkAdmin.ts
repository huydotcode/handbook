'use realtime-server';
import { getAuthSession } from '@/lib/auth';

export const checkAdmin = async () => {
    try {
        const session = await getAuthSession();
        if (!session?.user) return false;

        return session.user.role === 'admin';
    } catch (error: any) {
        console.log(error);
    }

    return false;
};
