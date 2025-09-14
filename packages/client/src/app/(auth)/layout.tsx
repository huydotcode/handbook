import { DarkmodeButton } from '@/components/ui';
import { getAuthSession } from '@/lib/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';

import {
    FaComments,
    FaPenFancy,
    FaSearch,
    FaStore,
    FaUser,
    FaUsers,
} from 'react-icons/fa';

const features = [
    {
        icon: <FaPenFancy className="h-8 w-8" />,
        title: 'Đăng bài & Tương tác',
        description:
            'Chia sẻ cảm xúc, hình ảnh và nhận phản hồi từ cộng đồng một cách nhanh chóng.',
        image: '/assets/img/lading_page_img_1.png',
        gradient: 'from-sky-400 to-blue-200',
    },
    {
        icon: <FaComments className="h-8 w-8" />,
        title: 'Nhắn tin cá nhân & nhóm',
        description:
            'Giao tiếp trực tiếp với bạn bè hoặc tạo nhóm để thảo luận, trao đổi tiện lợi.',
        gradient: 'from-cyan-500 to-teal-500',
    },
    {
        icon: <FaUser className="h-8 w-8" />,
        title: 'Trang cá nhân',
        description:
            'Xây dựng hồ sơ cá nhân độc đáo, chia sẻ sở thích và hoạt động của bạn.',
        gradient: 'from-teal-500 to-emerald-500',
    },
    {
        icon: <FaUsers className="h-8 w-8" />,
        title: 'Trang nhóm cộng đồng',
        description:
            'Tham gia hoặc tạo nhóm theo sở thích để kết nối với những người cùng chí hướng.',
        gradient: 'from-emerald-500 to-green-500',
    },
    {
        icon: <FaStore className="h-8 w-8" />,
        title: 'Chợ mua sắm',
        description:
            'Mua bán đồ cũ, hàng handmade hoặc sản phẩm cá nhân ngay trong nền tảng.',
        gradient: 'from-red-600 to-indigo-500',
    },
    {
        icon: <FaSearch className="h-8 w-8" />,
        title: 'Tìm kiếm người dùng',
        description:
            'Tìm kiếm bạn bè, nhóm hoặc bài viết nhanh chóng với hệ thống tìm kiếm thông minh.',
        gradient: 'from-sky-500 to-blue-500',
    },
];

interface Props {
    children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();

    // Middleware sẽ xử lý redirect, không cần redirect ở đây nữa
    // if (session) redirect('/');

    return (
        <div className="from-blue-50 dark:via-blue-900 relative min-h-screen overflow-hidden bg-gradient-to-br via-cyan-50 to-teal-100 dark:from-slate-900 dark:to-teal-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="from-blue-400 absolute -right-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r to-cyan-400 opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 opacity-20 blur-3xl"></div>
                <div className="to-blue-400 absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 opacity-10 blur-3xl"></div>
            </div>

            <DarkmodeButton className="fixed right-6 top-6 z-50 border border-white/30 bg-white/20 backdrop-blur-md transition-all duration-300 hover:bg-white/30 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30" />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-16 px-6 py-16">
                {/* Header Section */}
                <div className="flex w-full max-w-md flex-col items-center justify-center">
                    <div className="mb-8 space-y-6 text-center">
                        <div className="relative">
                            <h1 className="via-blue-600 dark:via-blue-400 animate-fade-in bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-cyan-400">
                                Chào mừng đến với
                            </h1>
                            <h1 className="via-blue-600 dark:via-blue-400 animate-fade-in bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-cyan-400">
                                Handbook
                            </h1>
                            <div className="from-blue-600/20 absolute -inset-4 -z-10 animate-pulse bg-gradient-to-r to-cyan-600/20 blur-2xl"></div>
                        </div>
                        <p className="animate-fade-in-delay-2 text-lg font-medium text-slate-600 dark:text-slate-300">
                            Đăng nhập hoặc đăng ký để bắt đầu trải nghiệm
                        </p>
                    </div>

                    <div className="animate-fade-in-delay-3 min-h-[500px] w-full">
                        {children}
                    </div>
                </div>

                <LandingFeatures />
            </div>
        </div>
    );
};

const LandingFeatures = () => {
    return (
        <section className="w-full">
            <div className="mx-auto max-w-6xl px-6 text-center">
                <div className="mb-16 space-y-4">
                    <h2 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-slate-300">
                        Tính năng nổi bật
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-400">
                        Khám phá những tính năng độc đáo giúp bạn kết nối và
                        chia sẻ
                    </p>
                    <div className="from-blue-500 mx-auto h-1 w-24 rounded-full bg-gradient-to-r to-cyan-500"></div>
                </div>

                <div className="grid grid-cols-3 gap-8 lg:grid-cols-2 md:grid-cols-1">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-8 text-left shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-800/70"
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            {/* Gradient overlay on hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                            ></div>

                            {/* Icon with gradient background */}
                            <div
                                className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br p-4 ${feature.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                            >
                                {feature.icon}
                            </div>

                            <h3 className="mb-3 text-xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-slate-900 dark:text-white dark:group-hover:text-white">
                                {feature.title}
                            </h3>

                            <p className="leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-slate-200">
                                {feature.description}
                            </p>

                            {/* Animated border */}
                            <div className="group-hover:border-gradient-to-r absolute inset-0 rounded-3xl border-2 border-transparent transition-all duration-500 group-hover:from-purple-400 group-hover:to-pink-400"></div>

                            {/* Floating animation dot */}
                            <div
                                className={`absolute right-4 top-4 h-3 w-3 rounded-full bg-gradient-to-r ${feature.gradient} animate-pulse opacity-0 transition-all duration-500 group-hover:opacity-100`}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Decorative elements */}
                <div className="mt-16 flex justify-center space-x-4">
                    <div className="bg-blue-400 h-2 w-2 animate-bounce rounded-full"></div>
                    <div
                        className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                        style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                        className="h-2 w-2 animate-bounce rounded-full bg-teal-400"
                        style={{ animationDelay: '0.2s' }}
                    ></div>
                </div>
            </div>
        </section>
    );
};

export default AuthLayout;
