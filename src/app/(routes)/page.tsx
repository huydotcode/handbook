import { FriendSection, Sidebar } from '@/components/layout';
import { InfinityPostComponent } from '@/components/post';

const HomePage = () => {
    return (
        <div>
            <Sidebar />

            <div className="mx-auto mt-2 w-[550px] md:w-full">
                <InfinityPostComponent />
            </div>

            <FriendSection />
        </div>
    );
};

export default HomePage;
