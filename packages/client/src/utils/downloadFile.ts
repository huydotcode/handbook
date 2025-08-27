import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

export const downloadImage = (image: IMedia) => {
    if (!image) {
        toast.error('Không thể tải ảnh');
        return;
    }

    saveAs(image.url, `${image._id}.png`);
};

export function convertFilesToBase64(files: File[]): Promise<string[]> {
    const promises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
            if (!file) {
                reject(new Error('Có lỗi trong quá trình đăng tải ảnh!'));
                return;
            }

            if (!file.type.includes('image')) {
                reject(
                    new Error(
                        `Sai định dạng! File ${file.name} không phải là ảnh.`
                    )
                );
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () =>
                reject(new Error(`Không thể xử lý file: ${file.name}`));
        });
    });

    return Promise.all(promises);
}
