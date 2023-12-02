'use client';
import { Button } from '@/components';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Page: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { data: session } = useSession();

    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repassword, setRepassword] = useState<string>('');

    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    const loginWithGoogle = async () => {
        try {
            setIsLoading(true);
            await signIn('google');
        } catch (error) {
            toast.error('Đăng nhập thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async () => {
        const form = {
            email,
            name,
            username,
            password,
            repassword,
        };

        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })
            .then(async (res) => {
                return res.json();
            })
            .then((data) => {
                toast.success('Đăng ký thành công');
            })
            .catch((err) => {
                toast.error('Đăng ký thất bại');
            });
    };

    return (
        <>
            <div className="flex h-screen items-center justify-center py-12 px-8 sm:px-6 lg:px-8 ">
                <div className="w-full flex flex-col items-center max-w-md space-y-8 px-10 py-10 rounded-xl shadow-lg bg-glass">
                    <h2 className="mt-6 text-center text-2xl tracking-tight">
                        Đăng ký với Handbook
                    </h2>

                    <div className="flex flex-col w-full">
                        <form action={signUp}>
                            <div className="flex flex-col">
                                <label htmlFor="username">Email của bạn</label>
                                <input
                                    className="p-2  bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="username">Tên đăng nhập</label>
                                <input
                                    className="p-2  bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Tên đăng nhập của bạn"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-col mt-2">
                                <label htmlFor="name">Họ và tên của bạn</label>
                                <input
                                    className="p-2  bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    type="text"
                                    id="name"
                                    name="fullname"
                                    placeholder="Họ và tên của bạn"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col mt-2">
                                <label htmlFor="password" className=" mt-2">
                                    Mật khẩu
                                </label>
                                <input
                                    className="p-2  bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-col mt-2">
                                <label htmlFor="repassword" className=" mt-2">
                                    Nhập lại mật khẩu
                                </label>
                                <input
                                    className="p-2 bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    type="password"
                                    id="repassword"
                                    name="repassword"
                                    placeholder="Nhập lại mật khẩu"
                                    value={repassword}
                                    onChange={(e) =>
                                        setRepassword(e.target.value)
                                    }
                                />
                            </div>

                            <Button
                                className="mt-6"
                                variant={'event'}
                                disabled={isLoading}
                            >
                                <h5 className="text-lg">Đăng ký</h5>
                            </Button>
                        </form>

                        <div className="flex justify-center items-center mt-4">
                            <h5>Bạn đã có tài khoản?</h5>
                            <Link
                                className="ml-2 text-blue-600 hover:underline"
                                href="/login"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </div>

                    <Button
                        variant={'event'}
                        size={'large'}
                        onClick={loginWithGoogle}
                        disabled={isLoading}
                    >
                        <svg
                            className="w-6 mr-2"
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fab"
                            data-icon="github"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <h5 className="text-base">Đăng nhập với Google</h5>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Page;
