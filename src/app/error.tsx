'use client';
import { Navbar } from '@/components/layout';
import { Button } from '@/components/ui/Button';

const ErrorPage = () => {
    return (
        <>
            <Navbar />
            <section className="flex h-full items-center p-16 dark:bg-gray-50 dark:text-gray-800">
                <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
                    <div className="max-w-md text-center">
                        <h2 className="mb-8 text-9xl font-extrabold dark:text-gray-400">
                            <span className="sr-only">Lỗi</span>500
                        </h2>
                        <p className="text-2xl font-semibold md:text-3xl">
                            Xin lỗi, đã có lỗi xảy ra.
                        </p>
                        <p className="mb-8 mt-4 dark:text-gray-600">
                            Bạn có thể thử lại sau! Xin lỗi vì sự bất tiện này.
                        </p>

                        <div
                            className={
                                'flex items-center justify-center gap-2 md:flex-col'
                            }
                        >
                            <Button
                                className={'px-8'}
                                variant={'secondary'}
                                onClick={() => window.location.reload()}
                            >
                                Thử lại
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ErrorPage;
