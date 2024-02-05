import { AiOutlineLoading, AiOutlineMenu } from 'react-icons/ai';
import { BiEdit, BiLogOut } from 'react-icons/bi';
import { BsFacebook, BsFileEarmarkPost, BsFillSendFill } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import {
    FaArrowLeft,
    FaCircle,
    FaImage,
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
    Logo: (props: IconProps) => <BsFacebook {...props} />,
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
                    className="outline"
                    viewBox="0 0 24 24"
                >
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="filled"
                    viewBox="0 0 24 24"
                >
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="100"
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
};

export default Icons;
