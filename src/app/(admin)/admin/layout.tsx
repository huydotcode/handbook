import { Navbar } from '@/components/layout';
import Sidebar from '@/app/(private)/admin/_components/Sidebar';
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
            <main className="relative mt-[56px] flex h-[calc(100vh-56px)] overflow-x-hidden overflow-y-scroll">
                <Sidebar />
                <div className="absolute left-[200px] w-[calc(100vw-200px)]">
                    {children}
                </div>
            </main>
        </>
    );
};

export default AdminLayout;
