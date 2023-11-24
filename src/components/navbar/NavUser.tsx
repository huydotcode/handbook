import { useSession } from 'next-auth/react';
import { Tooltip } from '@mui/material';
import { TbLogin } from 'react-icons/tb';
import Button from '../ui/Button';
import UserActionDropdown from './UserActionDropdown';
const NavUser = () => {
    const { data: session } = useSession();

    return (
        <>
            {session?.user ? (
                <UserActionDropdown />
            ) : (
                <>
                    <Tooltip title="Đăng nhập">
                        <Button
                            variant={'custom'}
                            size={'large'}
                            href="/login"
                            style={{ marginRight: 4 }}
                        >
                            <TbLogin />
                        </Button>
                    </Tooltip>
                </>
            )}
        </>
    );
};
export default NavUser;
