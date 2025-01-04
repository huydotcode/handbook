import logger from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Args = {
    agrs: any;
    fn: (...agrs: any) => Promise<any>;
    setState?: React.Dispatch<React.SetStateAction<any>>;
};

type State = {
    data: any;
    loading: boolean;
};

export default function useAsyncSession({ fn, setState, agrs }: Args): State {
    const { data: session } = useSession();
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!session?.user.id) return;
        (async () => {
            try {
                const data = await fn(agrs);

                if (data) {
                    if (setState) setState(data);
                    setData(data);
                }
            } catch (error: any) {
                logger({
                    message: 'Error useAsyncSession' + error,
                    type: 'error',
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [agrs, fn, session?.user.id, setState]);

    return { data, loading };
}
