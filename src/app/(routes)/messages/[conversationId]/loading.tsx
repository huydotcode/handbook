import { Loading } from '@/components/ui';

const LoadingPage = () => {
    return (
        <div className="h-full w-full bg-secondary-1 dark:bg-dark-secondary-1">
            <Loading
                fullScreen={false}
                overlay={false}
                className={'h-full w-full'}
            />
        </div>
    );
};

export default LoadingPage;
