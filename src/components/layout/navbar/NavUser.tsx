import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui';
import UserActionDropdown from './UserActionDropdown';
const NavUser = () => {
    const { data: session, status } = useSession();

    if (status == 'loading') {
        return (
            <div className="h-10 w-10 animate-skeleton rounded-full bg-light-500 dark:bg-dark-500"></div>
        );
    }

    return (
        <>
            {session?.user ? (
                <UserActionDropdown />
            ) : (
                <>
                    <Tooltip title="Đăng nhập">
                        <Button
                            className="rounded-xl bg-primary text-white"
                            variant={'custom'}
                            size={'small'}
                            href="/login"
                            style={{ marginRight: 4 }}
                        >
                            Đăng nhập
                        </Button>
                    </Tooltip>
                </>
            )}
        </>
    );
};
export default NavUser;
