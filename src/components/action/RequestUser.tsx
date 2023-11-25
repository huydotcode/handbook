'use client';
import { MenuItem } from '@mui/material';
// import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { Session } from 'next-auth';
import { FC, useEffect, useMemo, useState } from 'react';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { MdMoreVert } from 'react-icons/md';
import Button from '../ui/Button';
import Popover, { usePopover } from '../ui/Popover';

interface Props {
    session: Session;
    userId: string;
}

const RequestUser = () => {
    // const [user, setUser] = useState<User>();
    // const [currentUser, setCurrentUser] = useState<User>();
    // const hasRequestAddFriend =
    //     (user && user.request.some((req) => req.to == user._id)) || false;
    // const [isResquest, setIsRequest] = useState<boolean>(hasRequestAddFriend);
    // const isFriend = useMemo(() => {
    //     return currentUser?.friends.includes(user?._id);
    // }, [user, currentUser]);
    // const { anchorEl, handleClose, handleShow, open } = usePopover();
    // // Lấy dữ liệu của 2 người dùng
    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const res1 = await fetch(`/api/users/${userId}`);
    //             const data1 = await res1.json();
    //             const res2 = await fetch(`/api/users/${session?.user.id}`);
    //             const data2 = await res2.json();
    //             setUser(data1);
    //             setCurrentUser(data2);
    //         } catch (error: any) {
    //             throw new Error(error);
    //         }
    //     })();
    // }, [session, userId]);
    // const handleAddFriend = () => {
    //     if (isResquest) {
    //         // Hủy yêu cầu kết bạn
    //         (async () => {})();
    //     } else {
    //         // Gửi yêu cầu kết bạn
    //         (async () => {
    //             const docRef = await addDoc(
    //                 collection(db, 'notifications', userId, 'noification'),
    //                 {
    //                     type: 'friend',
    //                     send: {
    //                         ...session.user,
    //                     },
    //                     receive: userId,
    //                     message: 'đã gửi lời mời kết bạn',
    //                     isRead: false,
    //                     createdAt: Timestamp.now(),
    //                 }
    //             );
    //             // await addDoc(
    //             //   collection(
    //             //     db,
    //             //     "notifications",
    //             //     userId,
    //             //     "notification",
    //             //     session.user.id
    //             //   ),
    //             //   {
    //             //     type: "friend",
    //             //     send: {
    //             //       ...session.user,
    //             //     },
    //             //     receive: userId,
    //             //     message: "đã gửi lời mời kết bạn",
    //             //     isRead: false,
    //             //     createdAt: Timestamp.now(),
    //             //   }
    //             // );
    //         })();
    //     }
    //     setIsRequest((prev) => !prev);
    // };
    // const addFriend = async (id: string) => {
    //     try {
    //         // const response = await fetch(
    //         //   `/api/users/${session?.user.id}/friends/add/${id}`,
    //         //   {
    //         //     method: "POST",
    //         //     headers: {
    //         //       "Content-Type": "application/json",
    //         //     },
    //         //     body: JSON.stringify({
    //         //       type: "friend",
    //         //       receive: id,
    //         //       send: session?.user.id,
    //         //       message: "đã gửi cho bạn lời mời kết bạn",
    //         //     }),
    //         //   }
    //         // );
    //         // if (response.ok) {
    //         // }
    //     } catch (error: any) {
    //         throw new Error(error.message);
    //     }
    // };
    // const renderAction = () => {
    //     return (
    //         <>
    //             {!isFriend && (
    //                 <Button
    //                     className="bg-primary text-white hover:bg-[rgb(61,61,236)] p-2 rounded-xl"
    //                     onClick={handleAddFriend}
    //                 >
    //                     {isResquest ? (
    //                         'Hủy yêu cầu'
    //                     ) : (
    //                         <>
    //                             <BsFillPersonPlusFill className="text-lg mr-2" />
    //                             Thêm bạn bè
    //                         </>
    //                     )}
    //                 </Button>
    //             )}
    //         </>
    //     );
    // };
    // return (
    //     <>
    //         <div className="md:hidden">{renderAction()}</div>
    //         <Button
    //             className="justify-center items-center hidden md:flex bg-dark-500 w-8 h-8 rounded-xl"
    //             onClick={handleShow}
    //         >
    //             <MdMoreVert className="text-2xl" />
    //         </Button>
    //         <Popover anchorEl={anchorEl} handleClose={handleClose} open={open}>
    //             <MenuItem>{renderAction()}</MenuItem>
    //         </Popover>
    //         {isFriend && <div>Bạn bè</div>}
    //     </>
    // );
};

export default RequestUser;
