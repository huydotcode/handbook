// 'use client';
// import TimeAgo from 'react-timeago';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
//
// export const TimeAgoConverted = ({
//     time,
//     textBefore = '',
//     textAfter = '',
//     className = '',
// }) => {
//     const customVietnameseString = {
//         prefixAgo: null,
//         prefixFromNow: null,
//         suffixAgo: null,
//         suffixFromNow: `trước`,
//         seconds: `${textBefore} 1 phút ${textAfter}`,
//         minute: `${textBefore} 1 phút ${textAfter}`,
//         minutes: `${textBefore} %d phút ${textAfter}`,
//         hour: `${textBefore} 1 giờ ${textAfter}`,
//         hours: `${textBefore} %d giờ ${textAfter}`,
//         day: `${textBefore} 1 ngày ${textAfter}`,
//         days: `${textBefore} %d ngày ${textAfter}`,
//         month: `${textBefore} 1 tháng ${textAfter}`,
//         months: `${textBefore} %d tháng ${textAfter}`,
//         year: `${textBefore} 1 năm ${textAfter}`,
//         years: `${textBefore} %d năm ${textAfter}`,
//         wordSeparator: ` `,
//     };
//
//     const formatterTime = buildFormatter(customVietnameseString);
//
//     return (
//         <TimeAgo
//             className={className}
//             date={time}
//             formatter={formatterTime}
//             suppressHydrationWarning
//         />
//     );
// };
//
// export default TimeAgoConverted;
