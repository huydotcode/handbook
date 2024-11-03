export const FormatDate = {
    formatISODateToTime: (isoDate: Date) => {
        const date = new Date(isoDate);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    },
};
