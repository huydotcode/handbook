'use client';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const customVietnameseString = {
    prefixAgo: null,
    prefixFromNow: null,
    suffixAgo: null,
    suffixFromNow: 'trước',
    seconds: '1 phút',
    minute: '1 phút',
    minutes: '%d phút',
    hour: '1 giờ',
    hours: '%d giờ',
    day: '1 ngày',
    days: '%d ngày',
    month: '1 tháng',
    months: '%d tháng',
    year: '1 năm',
    years: '%d năm',
    wordSeparator: ' ',
};

export const formatterTime = buildFormatter(customVietnameseString);

const TimeAgoConverted = ({ time, className }) => {
    return (
        <TimeAgo
            className={className}
            date={time}
            formatter={formatterTime}
            suppressHydrationWarning
        />
    );
};

export default TimeAgoConverted;
