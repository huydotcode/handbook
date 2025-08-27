export const FormatDate = {
    formatISODateToTime: (isoDate: Date) => {
        const date = new Date(isoDate);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    },
    formatISODateToDate: (isoDate: Date) => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        return `${day}/${month}`;
    },
    formatISODateToDateTime: (isoDate: Date) => {
        const date = new Date(isoDate);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        return `${hours}:${minutes} ${day}/${month}`;
    },
    formatISODateToHHMM: (isoDate: Date) => {
        const date = new Date(isoDate);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    },
};
