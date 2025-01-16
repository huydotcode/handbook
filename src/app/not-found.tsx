import Link from 'next/link';
import { Navbar } from '@/components/layout';

const NotFoundPage = () => {
    return (
        <>
            <Navbar />
            <section className="mt-[56px] flex h-[calc(100vh-56px)] items-center p-16 dark:bg-dark-primary-1 dark:text-gray-800">
                <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
                    <div className="max-w-md text-center dark:text-dark-primary-1">
                        <h2 className="mb-8 text-9xl font-extrabold dark:text-gray-400">
                            <span className="sr-only">Lỗi</span>404
                        </h2>
                        <p className="text-2xl font-semibold dark:text-dark-primary-1 md:text-3xl">
                            Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
                        </p>
                        <p className="mb-8 mt-4 dark:text-dark-primary-1">
                            Nhưng đừng lo lắng, bạn có thể quay lại trang chủ để
                            tìm kiếm thông tin khác.
                        </p>
                        <Link
                            rel="noopener noreferrer"
                            href="/client/public"
                            className="rounded px-8 py-3 font-semibold dark:bg-violet-600 dark:text-gray-50"
                        >
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default NotFoundPage;
