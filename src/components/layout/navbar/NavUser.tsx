import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui';
import UserActionDropdown from './UserActionDropdown';
const NavUser = () => {
    const { data: session, status } = useSession();

    if (status == 'loading') {
        return (
            <div className="h-10 w-10 animate-skeleton rounded-full bg-skeleton"></div>
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
                            variant={'primary'}
                            href="/auth"
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
