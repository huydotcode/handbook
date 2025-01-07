import momment from 'moment';

// Format time to ago time ( locale VI
export const timeConvert = (time: string) => {
    return momment(time).locale('vi').fromNow();
};
