import { Navbar } from '@/components/layout';
import Sidebar from '@/components/pages/Admin/Sidebar';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface Props {
    children: React.ReactNode;
}

const AdminLayout = async ({ children }: Props) => {
    const session = await getAuthSession();

    if (session?.user.role != 'admin') redirect('/');

    return (
        <>
            <Navbar />
            <main className="relative mt-[56px] h-[calc(100vh-56px)] flex overflow-hidden">
                <Sidebar />
                {children}
            </main>
        </>
    );
};

export default AdminLayout;
