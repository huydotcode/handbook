// import { db } from '@/utils/firebase';
// import {
//     Timestamp,
//     addDoc,
//     collection,
//     limit,
//     onSnapshot,
//     orderBy,
//     query,
// } from 'firebase/firestore';
// import { Session } from 'next-auth';
// import { useSession } from 'next-auth/react';
// import { useEffect, useState } from 'react';

// interface Props {
//     receiveId?: string;
// }

// interface Notification {
//     type: string;
//     send: Session;
//     receive: string;
//     message: string;
//     isRead: boolean;
//     createdAt: Timestamp;
// }

// export default function useNotifications({ receiveId }: Props) {
//     const { data: session } = useSession();
//     const [notifications, setNotifications] = useState<Notification[]>([]);

//     // Thêm thông báo giả
//     const addNotification = async () => {
//         if (!session) return;

//         if (receiveId) {
//             await addDoc(
//                 collection(db, 'notifications', receiveId, 'notification'),
//                 {
//                     type: 'friend',
//                     send: {
//                         ...session.user,
//                     },
//                     receive: receiveId,
//                     message: 'đã gửi lời mời kết bạn',
//                     isRead: false,
//                     createdAt: Timestamp.now(),
//                 }
//             );
//         }
//     };

//     // Nhận thông báo với realtime
//     useEffect(() => {
//         if (!session) return;

//         const q = query(
//             collection(db, 'notifications', session.user.id, 'notification'),
//             orderBy('createdAt', 'desc'),
//             limit(5)
//         );

//         const unsub = onSnapshot(q, (querySnapshot) => {
//             let notis: any[] = [];

//             querySnapshot.forEach((doc) => {
//                 notis.push({
//                     id: doc.id,
//                     ...doc.data(),
//                 });
//             });

//             setNotifications(notis);
//         });

//         return () => {
//             unsub();
//         };
//     }, [session]);

//     return { notifications, setNotifications, addNotification };
// }
