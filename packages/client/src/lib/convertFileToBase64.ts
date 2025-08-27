export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.result) {
                resolve(reader.result.toString()); // Chuyển kết quả thành chuỗi
            } else {
                reject(new Error('Không thể đọc file'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Đã xảy ra lỗi khi đọc file'));
        };

        reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
    });
};
