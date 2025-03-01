'use client';
import Link from 'next/link';
import { Navbar } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

const ErrorPage = () => {
    const router = useRouter();

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
                            Nhưng đừng lo lắng, bạn có thể quay lại trang chủ để
                            tìm
                        </p>
                        <Button
                            rel="noopener noreferrer"
                            href="/"
                            className="rounded px-8 py-3 font-semibold dark:bg-violet-600 dark:text-gray-50"
                        >
                            Quay lại trang chủ
                        </Button>

                        <Button
                            rel="noopener noreferrer"
                            onClick={() => router.refresh()}
                            className="rounded px-8 py-3 font-semibold dark:bg-violet-600 dark:text-gray-50"
                        >
                            Thử lại
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ErrorPage;
