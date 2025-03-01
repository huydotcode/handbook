import momment from 'moment';

// Format time to ago time ( locale VI
export const timeConvert = (time: string) => {
    return momment(time).locale('vi').fromNow();
};

// Format time to 1 giờ, 1 ngày, 1 tháng, 1 năm
export const timeConvert2 = (time: string) => {
    return momment(time).locale('vi').format('LT');
};

// Format time to time ago 1m, 1h
export const timeConvert3 = (time: string) => {
    const now = momment();
    const end = momment(time);
    const duration = momment.duration(now.diff(end));
    const minutes = duration.asMinutes();
    const hours = duration.asHours();
    const days = duration.asDays();
    const months = duration.asMonths();
    const years = duration.asYears();

    if (minutes < 60) {
        return `${Math.floor(minutes)} phút`;
    } else if (hours < 24) {
        return `${Math.floor(hours)} giờ`;
    } else if (days < 30) {
        return `${Math.floor(days)} ngày`;
    } else if (months < 12) {
        return `${Math.floor(months)} tháng`;
    }

    return `${Math.floor(years)} năm`;
};
