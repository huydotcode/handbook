import { Icons } from '@/components/ui';
import React, { JSX } from 'react';

interface Audience {
    value: string;
    label: string;
    icon?: React.JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
}

const postAudience: Audience[] = [
    { value: 'public', label: 'Công khai', icon: Icons.Public },
    { value: 'friends', label: 'Chỉ bạn bè', icon: Icons.Users },
    { value: 'private', label: 'Chỉ mình tôi', icon: Icons.Private },
];
export default postAudience;
