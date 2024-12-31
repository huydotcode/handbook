import { Loading } from '@/components/ui';

const LoadingPage = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loading overlay={false} />
        </div>
    );
};

export default LoadingPage;
