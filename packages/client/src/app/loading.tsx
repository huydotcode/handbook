import { Navbar } from '@/components/layout';
import { Loading } from '@/components/ui';

const LoadingPage = () => {
    return (
        <>
            <Navbar />
            <Loading fullScreen />
        </>
    );
};

export default LoadingPage;
