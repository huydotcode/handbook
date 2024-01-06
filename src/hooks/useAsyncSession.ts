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
    const { data: session, status } = useSession();
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (status === 'unauthenticated') return;

        (async () => {
            try {
                const data = await fn(agrs);

                if (setState) setState(data);
                setData(data);
            } catch (error: any) {
                throw new Error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [status]);

    return { data, loading };
}
