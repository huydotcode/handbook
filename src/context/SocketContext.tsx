'use client';
import { useSession } from 'next-auth/react';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { socket } from '@/lib/socket';

type SocketContextType = {
    isConnected: boolean;
};

export const SocketContext = createContext<SocketContextType>({
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (!session?.user.id) {
            socket.disconnect();
            return;
        }

        if (isConnected) return;

        (async () => {
            try {
                socket.connect();

                socket.on('connect', () => {
                    console.log('Connected to socket');
                    setIsConnected(true);
                });

                socket.on('disconnect', () => {
                    console.log('Disconnected to socket');
                    setIsConnected(false);
                });

                socket.on('connect_error', (err) => {
                    setIsConnected(false);
                });
            } catch (error) {
                throw new Error("Can't connect to socket");
            }
        })();

        return () => {
            socket.disconnect();
        };
    }, [session?.user.id]);

    const values = {
        isConnected,
    };

    if (!session) return children;

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
