'use client';
import { ConversationService, UserService } from '@/lib/services';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type SocialContextType = {
    friends: IFriend[];
    conversations: IConversation[];
    setFriends: React.Dispatch<React.SetStateAction<IFriend[]>>;
    setConversations: React.Dispatch<React.SetStateAction<IConversation[]>>;
    followers: IFriend[];
    setFollowers: React.Dispatch<React.SetStateAction<IFriend[]>>;
};

export const SocialContext = createContext<SocialContextType>({
    friends: [],
    conversations: [],
    setFriends: () => {},
    setConversations: () => {},
    followers: [],
    setFollowers: () => {},
});

export const useSocial = () => useContext(SocialContext);

function SocialProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    const [friends, setFriends] = useState<IFriend[]>([]);
    const [followers, setFollowers] = useState<IFriend[]>([]);
    const [conversations, setConversations] = useState<IConversation[]>([]);

    // Lấy danh sách các user mà user hiện tại đang theo dõi
    const getFollowers = async () => {
        console.log('SocketContext: getFollowers');
        try {
            const followers = await UserService.getFollowersByUserId({
                userId: session?.user.id as string,
            });

            setFollowers(followers);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách người theo dõi');
        }
    };

    // Lấy danh sách conversation
    const getConversations = async () => {
        console.log('SocketContext: getConversations');
        try {
            const conversations = await ConversationService.getConversations();
            setConversations(conversations);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách cuộc trò chuyện');
        }
    };

    // Lấy danh sách bạn bè
    const getFriends = async () => {
        console.log('SocketContext: getFriends');
        try {
            const friends = await UserService.getFriends({
                userId: session?.user.id as string,
            });

            setFriends(friends);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách bạn bè');
        }
    };

    // Lấy danh sách bạn bè, danh sách cuộc trò chuyện
    useEffect(() => {
        (async () => {
            if (session?.user) {
                await getConversations();
                await getFriends();
                await getFollowers();
            }
        })();
    }, [session?.user.id]);

    const values = {
        conversations,
        friends,
        setConversations,
        setFriends,
        followers,
        setFollowers,
    } as SocialContextType;

    if (!session) return children;

    return (
        <SocialContext.Provider value={values}>
            {children}
        </SocialContext.Provider>
    );
}

export default SocialProvider;
