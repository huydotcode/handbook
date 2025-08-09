'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, {
    ChangeEvent,
    DragEventHandler,
    FormEventHandler,
    useCallback,
    useRef,
    useState,
} from 'react';

interface Props {
    className?: string;
    handleChange?: (files: File[]) => void;
    single?: boolean;
    onlyImage?: boolean; // Chỉ cho phép hình ảnh
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
    const containerRef = useRef<HTMLDivElement>(null);

    // Xử lý chung cho cả drop và input file
    const handleNewFiles = useCallback(
        (newFiles: File[]) => {
            console.log('Handle new files New files added:', newFiles);
            // Nếu có file mới, cập nhật state files
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);

            // handleChange?.(newFiles);
            handleChange?.(newFiles.length > 0 ? newFiles : files); // Gọi hàm handleChange nếu có, truyền vào mảng mới hoặc mảng hiện tại nếu không có file mới
        },
        [files, handleChange]
    );

    // Xử lý drop file
    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const droppedFiles = e.dataTransfer.files;
            handleNewFiles(Array.from(droppedFiles || []));
            setIsDragging(false);
        },
        [handleNewFiles]
    );

    // Xử lý drag over
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (e.type === 'dragenter') {
            setIsDragging(true);
        }
    }, []);

    // Kiểm tra khi drag leave khỏi container
    const handleDragLeave = useCallback((e: React.DragEvent) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    }, []);

    // Xử lý chọn file từ input
    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newFiles = e.target.files
                ? Array.from(e.target.files || [])
                : [];
            handleNewFiles(newFiles);
        },
        [handleNewFiles]
    );

    return (
        <div
            ref={containerRef}
            className={className}
            onDragEnter={handleDrag}
            onDragLeave={handleDragLeave}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {/* Overlay khi dragging */}
            <DragOverlay
                isVisible={isDragging}
                onFileSelect={handleFileSelect}
            />

            {/* Children content */}
            {children}
        </div>
    );
};

// Component phụ trách overlay drag
const DragOverlay = ({
    isVisible,
    onFileSelect,
}: {
    isVisible: boolean;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label
            htmlFor="file"
            className={cn(
                'absolute inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-gray-700 bg-secondary-2 p-8 transition-opacity dark:bg-dark-secondary-1',
                isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
        >
            <svg viewBox="0 0 640 512" className="mb-5 h-12 fill-gray-700">
                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
            </svg>
            <p>Kéo & thả</p>
            <p>hoặc</p>
            <span className="rounded-lg bg-gray-700 px-4 py-1 text-white transition duration-300 hover:bg-gray-900">
                Tải lên
            </span>
            <input
                id="file"
                type="file"
                className="hidden"
                onChange={onFileSelect}
                multiple
            />
        </label>
    );
};

const FileUploader: React.FC<Props> = ({
    className,
    handleChange,
    single = false,
    onlyImage = false, // Chỉ cho phép hình ảnh
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const acceptType = onlyImage ? 'image/*' : 'video/*, image/*';

    // Xử lý khi chọn file từ input
    const handleFileSelect = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            console.log(
                'handleFileSelect called with files:',
                event.target.files
            );
            const newFiles = event.target.files
                ? Array.from(event.target.files || [])
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
                ? Array.from(event.dataTransfer.files || [])
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
                'flex h-fit w-full flex-wrap items-center justify-center gap-1',
                className
            )}
            onDrop={handleDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
            onDragLeave={preventDefault}
        >
            <input
                id="file"
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                multiple={!single}
                accept={acceptType}
            />

            {files.length == 0 ? (
                <>
                    <label
                        htmlFor="file"
                        className="w-full cursor-pointer rounded-3xl border-2 border-dashed border-secondary-2 bg-secondary-1 p-8 dark:bg-dark-secondary-1"
                    >
                        <div className="flex flex-col items-center justify-center gap-1">
                            <svg
                                viewBox="0 0 640 512"
                                className="mb-5 h-12 fill-dark-primary-1 dark:fill-primary-1"
                            >
                                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                            </svg>
                            <p>Kéo & thả</p>
                            <p>hoặc</p>
                            <span className="rounded-lg bg-secondary-2 px-4 py-1 transition duration-300 hover:bg-primary-1 dark:bg-dark-secondary-2 dark:hover:bg-dark-primary-1">
                                Tải lên
                            </span>
                        </div>
                    </label>
                </>
            ) : (
                <>
                    {files.slice(0, 3).map((file: any, index: number) => (
                        <div
                            key={index}
                            className="relative mt-5 flex h-[200px] w-[200px] items-center gap-2 overflow-hidden rounded-xl"
                        >
                            <Image
                                className="h-full w-full object-cover"
                                alt={''}
                                src={URL.createObjectURL(file)}
                                width={200}
                                height={200}
                            />

                            <Button
                                onClick={() => handleRemove(index)}
                                className="absolute right-0 top-0"
                                size={'sm'}
                                variant={'secondary'}
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

                            <p className="absolute inset-0 flex items-center justify-center text-lg font-medium text-primary-1 dark:text-dark-primary-1">
                                +{files.length - 3}
                            </p>
                        </div>
                    )}

                    <div className="rounded-3xl border-2 border-dashed border-secondary-2 bg-secondary-1 px-8 py-4 dark:border-dark-secondary-2 dark:bg-dark-secondary-1">
                        <label
                            htmlFor="file"
                            className="cursor-pointer rounded-3xl"
                        >
                            <div className="flex flex-col items-center justify-center gap-1 text-sm">
                                <p>Kéo & thả</p>
                                <p>hoặc</p>
                                <span className="rounded-lg bg-secondary-2 px-4 py-1 text-sm transition duration-300 hover:bg-primary-1 dark:bg-dark-secondary-2 dark:hover:bg-dark-primary-1">
                                    Tải lên
                                </span>
                            </div>
                        </label>
                    </div>
                </>
            )}
        </div>
    );
};

export default FileUploader;
