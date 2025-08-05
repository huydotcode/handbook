import { Loading } from '@/components/ui';

const LoadingPage = () => {
    return (
        <div className="bg-blue-500 h-full w-full dark:bg-dark-secondary-1">
            <Loading
                fullScreen={false}
                overlay={false}
                className={'h-full w-full'}
            />
        </div>
    );
};

export default LoadingPage;
