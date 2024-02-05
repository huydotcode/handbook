import React from 'react';

interface Props {
    data: IUser;
}

const Users: React.FC<Props> = ({ data: user }) => {
    return <div>Users</div>;
};
export default Users;
