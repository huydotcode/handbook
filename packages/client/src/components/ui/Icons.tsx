'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { AiOutlineLoading, AiOutlineMenu } from 'react-icons/ai';
import { BiDetail, BiEdit, BiLogOut } from 'react-icons/bi';
import {
    BsFileEarmarkPost,
    BsFillFileBreakFill,
    BsFillSendFill,
    BsPinAngleFill,
    BsTextParagraph,
} from 'react-icons/bs';
import { CgClose, CgProfile } from 'react-icons/cg';
import { CiSettings } from 'react-icons/ci';
import {
    FaArrowLeft,
    FaBirthdayCake,
    FaBold,
    FaCircle,
    FaHashtag,
    FaHeart,
    FaImage,
    FaItalic,
    FaListUl,
    FaPlus,
    FaRegComment,
    FaRegFileCode,
    FaReply,
    FaShare,
    FaUsers,
} from 'react-icons/fa';
import {
    FaBookmark,
    FaBoxArchive,
    FaCar,
    FaCode,
    FaDownload,
    FaEye,
    FaFilter,
    FaLink,
    FaLocationDot,
    FaShirt,
    FaShop,
} from 'react-icons/fa6';
import { GoSearch } from 'react-icons/go';
import { GrRedo, GrUndo } from 'react-icons/gr';
import { HiHome } from 'react-icons/hi';
import { ImStrikethrough } from 'react-icons/im';
import {
    IoIosArrowBack,
    IoIosArrowDown,
    IoIosArrowForward,
    IoIosArrowUp,
    IoIosCreate,
    IoMdLaptop,
    IoMdSchool,
} from 'react-icons/io';
import {
    IoCamera,
    IoChatbubbleEllipses,
    IoPersonAdd,
    IoTime,
} from 'react-icons/io5';
import {
    MdCall,
    MdCallEnd,
    MdEmojiEmotions,
    MdGroups,
    MdHorizontalRule,
    MdMic,
    MdMicOff,
    MdMoreVert,
    MdNotifications,
    MdNotificationsActive,
    MdOutlineKeyboardArrowRight,
    MdPublic,
    MdSort,
    MdVideocam,
    MdVideocamOff,
    MdVolumeOff,
    MdVolumeUp,
    MdWork,
} from 'react-icons/md';
import {
    RiAdminFill,
    RiDeleteBin5Fill,
    RiGitRepositoryPrivateFill,
    RiVerifiedBadgeFill,
} from 'react-icons/ri';
import { TbBlockquote, TbClearFormatting } from 'react-icons/tb';
import { TiTick } from 'react-icons/ti';
import { VscClearAll, VscColorMode } from 'react-icons/vsc';

export interface IconProps extends React.SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
}

const Icons = {
    Logo: (props: IconProps) => {
        return (
            <Image
                className={cn('rounded-full', props.className)}
                src="/assets/img/logo.png"
                alt="Logo"
                width={64}
                height={64}
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
    Loading: (props: IconProps) => (
        <AiOutlineLoading
            {...props}
            className={cn('animate-spin text-secondary-1', props.className)}
        />
    ),
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
    Shop: (props: IconProps) => <FaShop {...props} />,
    Google: (props: IconProps) => (
        <svg
            className={cn('h-6 w-6', props.className)}
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
    Gemini: (props: IconProps) => {
        return (
            <Image
                src={'/assets/img/Google_Gemini_logo.svg.png'}
                alt="Gemini"
                width={64}
                height={64}
            />
        );
    },
    Profile: (props: IconProps) => <CgProfile {...props} />,
    Upload: (props: IconProps) => <FaImage {...props} />,
    Emoji: (props: IconProps) => <MdEmojiEmotions {...props} />,
    Eye: (props: IconProps) => <FaEye {...props} />,
    Car: (props: IconProps) => <FaCar {...props} />,
    Shirt: (props: IconProps) => <FaShirt {...props} />,
    Laptop: (props: IconProps) => <IoMdLaptop {...props} />,
    Time: (props: IconProps) => <IoTime {...props} />,
    Download: (props: IconProps) => <FaDownload {...props} />,
    Bookmark: (props: IconProps) => <FaBookmark {...props} />,
    Verified: (props: IconProps) => (
        <RiVerifiedBadgeFill
            className={cn(props.className, 'text-primary-2')}
            {...props}
        />
    ),
    Pin: (props: IconProps) => <BsPinAngleFill {...props} />,
    CreatePost: (props: IconProps) => <IoIosCreate {...props} />,
    Archive: (props: IconProps) => <FaBoxArchive {...props} />,
    Public: (props: IconProps) => <MdPublic {...props} />,
    Private: (props: IconProps) => <RiGitRepositoryPrivateFill {...props} />,
    Sort: (props: IconProps) => (
        <MdSort
            className={cn('text-secondary-1', props.className)}
            {...props}
        />
    ),
    Link: (props: IconProps) => (
        <FaLink
            className={cn('text-secondary-1', props.className)}
            {...props}
        />
    ),
    Detail: (props: IconProps) => {
        return (
            <BiDetail
                className={cn('text-secondary-1', props.className)}
                {...props}
            />
        );
    },
    Tag: (props: IconProps) => {
        return <FaHashtag className={cn(props.className)} {...props} />;
    },
    Filter: (props: IconProps) => {
        return (
            <FaFilter
                className={cn('text-secondary-1', props.className)}
                {...props}
            />
        );
    },
    // Video call icons
    VideoCall: (props: IconProps) => <MdVideocam {...props} />,
    VideoCallOff: (props: IconProps) => <MdVideocamOff {...props} />,
    Mic: (props: IconProps) => <MdMic {...props} />,
    MicOff: (props: IconProps) => <MdMicOff {...props} />,
    Phone: (props: IconProps) => <MdCall {...props} />,
    PhoneEnd: (props: IconProps) => <MdCallEnd {...props} />,
    Camera: (props: IconProps) => <IoCamera {...props} />,
    CameraOff: (props: IconProps) => <MdVideocamOff {...props} />,
    VolumeUp: (props: IconProps) => <MdVolumeUp {...props} />,
    VolumeOff: (props: IconProps) => <MdVolumeOff {...props} />,
    Theme: (props: IconProps) => {
        return <VscColorMode {...props} />;
    },
    Setting: (props: IconProps) => {
        return <CiSettings {...props} />;
    },
};

export const MenuBarEditorIcons = {
    Bold: (props: IconProps) => <FaBold {...props} />,
    Italic: (props: IconProps) => <FaItalic {...props} />,
    Strike: (props: IconProps) => <ImStrikethrough {...props} />,
    CodeBlock: (props: IconProps) => <FaRegFileCode {...props} />,
    ClearMark: (props: IconProps) => <TbClearFormatting {...props} />,
    ClearNode: (props: IconProps) => <VscClearAll {...props} />,
    Paragraph: (props: IconProps) => <BsTextParagraph {...props} />,
    BulletList: (props: IconProps) => <FaListUl {...props} />,
    Code: (props: IconProps) => <FaCode {...props} />,
    Blockquote: (props: IconProps) => <TbBlockquote {...props} />,
    HorizontalRule: (props: IconProps) => <MdHorizontalRule {...props} />,
    HardBreak: (props: IconProps) => <BsFillFileBreakFill {...props} />,
    Undo: (props: IconProps) => <GrUndo {...props} />,
    Redo: (props: IconProps) => <GrRedo {...props} />,
};

export const IconsArray = [
    {
        name: 'Download',
        icon: Icons.Download,
    },
    {
        name: 'Logo',
        icon: Icons.Time,
    },
    {
        name: 'Laptop',
        icon: Icons.Laptop,
    },
    {
        name: 'Menu',
        icon: Icons.Menu,
    },
    {
        name: 'Home',
        icon: Icons.Home,
    },
    {
        name: 'Message',
        icon: Icons.Message,
    },
    {
        name: 'Group',
        icon: Icons.Group,
    },
    {
        name: 'Users',
        icon: Icons.Users,
    },
    {
        name: 'Posts',
        icon: Icons.Posts,
    },
    {
        name: 'Images',
        icon: Icons.Images,
    },
    {
        name: 'Notification',
        icon: Icons.Notification,
    },
    {
        name: 'NotificationActive',
        icon: Icons.NotificationActive,
    },
    {
        name: 'ArrowDown',
        icon: Icons.ArrowDown,
    },
    {
        name: 'ArrowUp',
        icon: Icons.ArrowUp,
    },
    {
        name: 'ArrowLeft',
        icon: Icons.ArrowLeft,
    },
    {
        name: 'ArrowRight',
        icon: Icons.ArrowRight,
    },
    {
        name: 'ArrowBack',
        icon: Icons.ArrowBack,
    },
    {
        name: 'ArrowForward',
        icon: Icons.ArrowForward,
    },
    {
        name: 'Admin',
        icon: Icons.Admin,
    },
    {
        name: 'Loading',
        icon: Icons.Loading,
    },
    {
        name: 'Send',
        icon: Icons.Send,
    },
    {
        name: 'Comment',
        icon: Icons.Comment,
    },
    {
        name: 'More',
        icon: Icons.More,
    },
    {
        name: 'Delete',
        icon: Icons.Delete,
    },
    {
        name: 'Edit',
        icon: Icons.Edit,
    },
    {
        name: 'Heart',
        icon: Icons.Heart,
    },
    {
        name: 'Heart2',
        icon: Icons.Heart2,
    },
    {
        name: 'Close',
        icon: Icons.Close,
    },
    {
        name: 'Search',
        icon: Icons.Search,
    },
    {
        name: 'Circle',
        icon: Icons.Circle,
    },
    {
        name: 'LogOut',
        icon: Icons.LogOut,
    },
    {
        name: 'Tick',
        icon: Icons.Tick,
    },
    {
        name: 'Share',
        icon: Icons.Share,
    },
    {
        name: 'Location',
        icon: Icons.Location,
    },
    {
        name: 'School',
        icon: Icons.School,
    },
    {
        name: 'Work',
        icon: Icons.Work,
    },
    {
        name: 'PersonAdd',
        icon: Icons.PersonAdd,
    },
    {
        name: 'Reply',
        icon: Icons.Reply,
    },
    {
        name: 'Birthday',
        icon: Icons.Birthday,
    },
    {
        name: 'Plus',
        icon: Icons.Plus,
    },
    {
        name: 'Shop',
        icon: Icons.Shop,
    },
    {
        name: 'Google',
        icon: Icons.Google,
    },
    {
        name: 'Gemini',
        icon: Icons.Gemini,
    },
    {
        name: 'Profile',
        icon: Icons.Profile,
    },
    {
        name: 'Upload',
        icon: Icons.Upload,
    },
    {
        name: 'Emoji',
        icon: Icons.Emoji,
    },
    {
        name: 'Eye',
        icon: Icons.Eye,
    },
    {
        name: 'Car',
        icon: Icons.Car,
    },
    {
        name: 'Shirt',
        icon: Icons.Shirt,
    },
    {
        name: 'Time',
        icon: Icons.Time,
    },
    {
        name: 'Bookmark',
        icon: Icons.Bookmark,
    },
    {
        name: 'Verified',
        icon: Icons.Verified,
    },
    {
        name: 'Pin',
        icon: Icons.Pin,
    },
    {
        name: 'CreatePost',
        icon: Icons.CreatePost,
    },
    {
        name: 'Archive',
        icon: Icons.Archive,
    },
    {
        name: 'Public',
        icon: Icons.Public,
    },
    {
        name: 'Private',
        icon: Icons.Private,
    },
    {
        name: 'Sort',
        icon: Icons.Sort,
    },
    {
        name: 'Link',
        icon: Icons.Link,
    },
].sort((a, b) => a.name.localeCompare(b.name));

export default Icons;
