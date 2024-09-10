import { cn } from '@/lib/utils';
import Image from 'next/image';
import { AiOutlineLoading, AiOutlineMenu, AiOutlineShop } from 'react-icons/ai';
import { BiEdit, BiLogOut } from 'react-icons/bi';
import { BsFileEarmarkPost, BsFillSendFill } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import {
    FaArrowLeft,
    FaBirthdayCake,
    FaCircle,
    FaHeart,
    FaImage,
    FaPlus,
    FaRegComment,
    FaReply,
    FaShare,
    FaUsers,
} from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { GoSearch } from 'react-icons/go';
import { HiHome } from 'react-icons/hi';
import {
    IoIosArrowBack,
    IoIosArrowDown,
    IoIosArrowForward,
    IoIosArrowUp,
    IoMdSchool,
} from 'react-icons/io';
import { IoChatbubbleEllipses, IoPersonAdd } from 'react-icons/io5';
import {
    MdGroups,
    MdMoreVert,
    MdNotifications,
    MdNotificationsActive,
    MdOutlineKeyboardArrowRight,
    MdWork,
} from 'react-icons/md';
import { RiAdminFill, RiDeleteBin5Fill } from 'react-icons/ri';
import { TiTick } from 'react-icons/ti';

interface IconProps extends React.SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
}

const Icons = {
    Logo: (props: IconProps) => {
        return (
            <Image
                src="/assets/img/logo.webp"
                alt="Logo"
                width={32}
                height={32}
            />
        );
    },

    Menu: (props: IconProps) => <AiOutlineMenu {...props} />,
    Home: (props: IconProps) => <HiHome {...props} />,
    Message: (props: IconProps) => <IoChatbubbleEllipses {...props} />,
    Group: (props: IconProps) => <MdGroups {...props} />,
    Users: (props: IconProps) => <FaUsers {...props} />,
    Posts: (props: IconProps) => <BsFileEarmarkPost {...props} />,
    Images: (props: IconProps) => <FaImage {...props} />,
    Notification: (props: IconProps) => <MdNotifications {...props} />,
    NotificationActive: (props: IconProps) => (
        <MdNotificationsActive {...props} />
    ),
    ArrowDown: (props: IconProps) => <IoIosArrowDown {...props} />,
    ArrowUp: (props: IconProps) => <IoIosArrowUp {...props} />,
    ArrowLeft: (props: IconProps) => <FaArrowLeft {...props} />,
    ArrowRight: (props: IconProps) => (
        <MdOutlineKeyboardArrowRight {...props} />
    ),
    ArrowBack: (props: IconProps) => <IoIosArrowBack {...props} />,
    ArrowForward: (props: IconProps) => <IoIosArrowForward {...props} />,
    Admin: (props: IconProps) => <RiAdminFill {...props} />,
    Loading: (props: IconProps) => <AiOutlineLoading {...props} />,
    Send: (props: IconProps) => <BsFillSendFill {...props} />,
    Comment: (props: IconProps) => <FaRegComment {...props} />,
    More: (props: IconProps) => <MdMoreVert {...props} />,
    Delete: (props: IconProps) => <RiDeleteBin5Fill {...props} />,
    Edit: (props: IconProps) => <BiEdit {...props} />,
    Heart: (props: IconProps) => {
        return (
            <>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="outline-none"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="filled"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="100"
                    fill="currentColor"
                    width="100"
                    className="celebrate"
                >
                    <polygon className="poly" points="10,10 20,20"></polygon>
                    <polygon className="poly" points="10,50 20,50"></polygon>
                    <polygon className="poly" points="20,80 30,70"></polygon>
                    <polygon className="poly" points="90,10 80,20"></polygon>
                    <polygon className="poly" points="90,50 80,50"></polygon>
                    <polygon className="poly" points="80,80 70,70"></polygon>
                </svg>
            </>
        );
    },
    Heart2: (props: IconProps) => <FaHeart {...props} />,
    Close: (props: IconProps) => <CgClose {...props} />,
    Search: (props: IconProps) => <GoSearch {...props} />,
    Circle: (props: IconProps) => <FaCircle {...props} />,
    LogOut: (props: IconProps) => <BiLogOut {...props} />,
    Tick: (props: IconProps) => <TiTick {...props} />,
    Share: (props: IconProps) => <FaShare {...props} />,
    Location: (props: IconProps) => <FaLocationDot {...props} />,
    School: (props: IconProps) => <IoMdSchool {...props} />,
    Work: (props: IconProps) => <MdWork {...props} />,
    PersonAdd: (props: IconProps) => <IoPersonAdd {...props} />,
    Reply: (props: IconProps) => <FaReply {...props} />,
    Birthday: (props: IconProps) => <FaBirthdayCake {...props} />,
    Plus: (props: IconProps) => <FaPlus {...props} />,
    Shop: (props: IconProps) => <AiOutlineShop {...props} />,
    Google: (props: IconProps) => (
        <svg
            className={cn('h-6 w-6', props.className)}
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
    ),
};

export default Icons;
