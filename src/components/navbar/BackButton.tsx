import { usePathname, useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import Button from '../ui/Button';

const BackButton = () => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            {pathname !== '/' && (
                <Button
                    className="hidden md:flex text-4xl rounded-md mr-4 text-gray-500 hover:bg-gray-200 hover:text-gray-700
           dark:hover:bg-dark-100 dark:hover:text-gray-300"
                    onClick={() => router.back()}
                >
                    <IoIosArrowBack />
                </Button>
            )}
        </>
    );
};
export default BackButton;
