interface Audience {
    value: string;
    label: string;
}

const postAudience: Audience[] = [
    { value: 'public', label: 'Công khai' },
    { value: 'friends', label: 'Chỉ bạn bè' },
    { value: 'private', label: 'Chỉ mình tôi' },
];
export default postAudience;
