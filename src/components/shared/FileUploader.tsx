import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, {
    ChangeEvent,
    DragEventHandler,
    FormEventHandler,
    useCallback,
    useEffect,
    useState,
} from 'react';

interface Props {
    className?: string;
    handleChange?: (files: File[]) => void;
}

export const FileUploaderWrapper = ({
    className,
    handleChange,
    children,
}: {
    className?: string;
    handleChange?: (files: File[]) => void;
    children: React.ReactNode;
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // Function to handle file selection (from both drag-and-drop and browse)
    const handleFileSelect = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const newFiles = event.target.files
                ? Array.from(event.target.files)
                : [];
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            if (handleChange) {
                handleChange(newFiles);
            }
        },
        [handleChange]
    );

    // Xử lý khi thả file vào
    const handleDrop: DragEventHandler<HTMLDivElement> = useCallback(
        (event) => {
            event.preventDefault();
            const droppedFiles = event.dataTransfer.files
                ? Array.from(event.dataTransfer.files)
                : [];
            setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
            if (handleChange) {
                handleChange(droppedFiles);
            }
        },
        [handleChange]
    );

    // Ngăn chặn hành động mặc định
    const preventDefault: FormEventHandler<HTMLDivElement> = (event) =>
        event.preventDefault();

    // Bỏ file khỏi danh sách
    const handleRemove = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        if (handleChange) {
            handleChange(files.filter((_, i) => i !== index));
        }
    };

    return (
        <div
            className={cn('relative', className)}
            onDrop={handleDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
            onDragLeave={preventDefault}
        >
            {isDragging && (
                <label
                    htmlFor="file"
                    className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer rounded-3xl border-2 border-dashed border-gray-700 bg-secondary-2 p-8 dark:bg-dark-secondary-1"
                >
                    <div className="flex flex-col items-center justify-center gap-1">
                        <svg
                            viewBox="0 0 640 512"
                            className="mb-5 h-12 fill-gray-700"
                        >
                            <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                        </svg>
                        <p>Kéo & thả</p>
                        <p>hoặc</p>
                        <span className="rounded-lg bg-gray-700 px-4 py-1 text-white transition duration-300 hover:bg-gray-900">
                            Tải lên
                        </span>
                    </div>
                    <input
                        id="file"
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        multiple
                    />
                </label>
            )}

            {children}

            {/* {files.length == 0 ? (
                <>
                    <label
                        htmlFor="file"
                        className="w-full cursor-pointer rounded-3xl border-2 border-dashed border-gray-700 bg-secondary-2 p-8 dark:bg-dark-secondary-1"
                    >
                        <div className="flex flex-col items-center justify-center gap-1">
                            <svg
                                viewBox="0 0 640 512"
                                className="mb-5 h-12 fill-gray-700"
                            >
                                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                            </svg>
                            <p>Kéo & thả</p>
                            <p>hoặc</p>
                            <span className="rounded-lg bg-gray-700 px-4 py-1 text-white transition duration-300 hover:bg-gray-900">
                                Tải lên
                            </span>
                        </div>
                        <input
                            id="file"
                            type="file"
                            className="hidden"
                            onChange={handleFileSelect}
                            multiple
                        />
                    </label>
                </>
            ) : (
                <>
                    {files.slice(0, 3).map((file: any, index: number) => (
                        <div
                            key={index}
                            className="relative mt-5 flex items-center gap-2"
                        >
                            <Image
                                alt={''}
                                src={URL.createObjectURL(file)}
                                width={200}
                                height={200}
                            />

                            <Button
                                onClick={() => handleRemove(index)}
                                className="absolute right-0 top-0"
                            >
                                <Icons.Close />
                            </Button>
                        </div>
                    ))}

                    {files.length > 3 && (
                        <div className="relative mt-5 flex items-center gap-2">
                            <Image
                                className={'opacity-50'}
                                alt={''}
                                src={URL.createObjectURL(files[3])}
                                width={200}
                                height={200}
                            />
                        </div>
                    )}
                </>
            )} */}
        </div>
    );
};

const FileUploader: React.FC<Props> = ({ className, handleChange }) => {
    const [files, setFiles] = useState<File[]>([]);

    // Function to handle file selection (from both drag-and-drop and browse)
    const handleFileSelect = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const newFiles = event.target.files
                ? Array.from(event.target.files)
                : [];
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            if (handleChange) {
                handleChange(newFiles);
            }
        },
        [handleChange]
    );

    // Xử lý khi thả file vào
    const handleDrop: DragEventHandler<HTMLDivElement> = useCallback(
        (event) => {
            event.preventDefault();
            const droppedFiles = event.dataTransfer.files
                ? Array.from(event.dataTransfer.files)
                : [];
            setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
            if (handleChange) {
                handleChange(droppedFiles);
            }
        },
        [handleChange]
    );

    // Ngăn chặn hành động mặc định
    const preventDefault: FormEventHandler<HTMLDivElement> = (event) =>
        event.preventDefault();

    // Bỏ file khỏi danh sách
    const handleRemove = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        if (handleChange) {
            handleChange(files.filter((_, i) => i !== index));
        }
    };

    return (
        <div
            className={cn(
                'flex h-fit w-full items-center justify-center',
                className
            )}
            onDrop={handleDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
            onDragLeave={preventDefault}
        >
            {files.length == 0 ? (
                <>
                    <label
                        htmlFor="file"
                        className="w-full cursor-pointer rounded-3xl border-2 border-dashed border-gray-700 bg-secondary-2 p-8 dark:bg-dark-secondary-1"
                    >
                        <div className="flex flex-col items-center justify-center gap-1">
                            <svg
                                viewBox="0 0 640 512"
                                className="mb-5 h-12 fill-gray-700"
                            >
                                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                            </svg>
                            <p>Kéo & thả</p>
                            <p>hoặc</p>
                            <span className="rounded-lg bg-gray-700 px-4 py-1 text-white transition duration-300 hover:bg-gray-900">
                                Tải lên
                            </span>
                        </div>
                        <input
                            id="file"
                            type="file"
                            className="hidden"
                            onChange={handleFileSelect}
                            multiple
                        />
                    </label>
                </>
            ) : (
                <>
                    {files.slice(0, 3).map((file: any, index: number) => (
                        <div
                            key={index}
                            className="relative mt-5 flex items-center gap-2"
                        >
                            <Image
                                alt={''}
                                src={URL.createObjectURL(file)}
                                width={200}
                                height={200}
                            />

                            <Button
                                onClick={() => handleRemove(index)}
                                className="absolute right-0 top-0"
                            >
                                <Icons.Close />
                            </Button>
                        </div>
                    ))}

                    {files.length > 3 && (
                        <div className="relative mt-5 flex items-center gap-2">
                            <Image
                                className={'opacity-50'}
                                alt={''}
                                src={URL.createObjectURL(files[3])}
                                width={200}
                                height={200}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FileUploader;
