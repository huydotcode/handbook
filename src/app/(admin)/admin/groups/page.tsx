import { getGroups } from '@/lib/actions/admin/group.action';
import Image from 'next/image';
import UpdateGroup from '../_components/action/UpdateGroup';

const GroupsPage = async () => {
    const groups = (await getGroups()) as IGroup[];
    if (!groups) return null;

    return (
        <>
            <h1>Groups</h1>
            <ul className="grid grid-flow-col">
                {groups &&
                    groups.map((group) => (
                        <li
                            className="flex w-fit items-center bg-secondary-1 p-2"
                            key={group._id}
                        >
                            <span>
                                <Image
                                    src={group.image}
                                    alt={group.name}
                                    width={32}
                                    height={32}
                                />
                            </span>
                            <span className="flex flex-col">
                                <h3>{group.name}</h3>
                                <p>{group.description}</p>
                            </span>
                        </li>
                    ))}
            </ul>

            <UpdateGroup />
        </>
    );
};

export default GroupsPage;
