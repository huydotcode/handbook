import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

export const downloadImage = (image: IImage) => {
    if (!image) {
        toast.error('Không thể tải ảnh');
        return;
    }

    saveAs(image.url, `${image._id}.png`);
};
