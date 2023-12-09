import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import Button from '../ui/Button';
import UserActionDropdown from './UserActionDropdown';
const NavUser = () => {
    const { data: session, status } = useSession();

    if (status == 'loading') {
        return (
            <div className="w-10 h-10 rounded-full bg-light-500 animate-skeleton dark:bg-dark-500"></div>
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
                            className="bg-primary rounded-xl text-white"
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
