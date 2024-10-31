import { FriendSection, Sidebar } from '@/components/layout';
import { InfinityPostComponent } from '@/components/post';

const HomePage = () => {
    return (
        <div className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1200px] max-w-screen md:w-screen">
            <Sidebar />

            <div className="mx-auto mt-2 w-[550px] md:w-full">
                <InfinityPostComponent />
            </div>

            <FriendSection />
        </div>
    );
};

export default HomePage;
