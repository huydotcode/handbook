import { getGroups } from '@/lib/actions/admin/group.action';
import Image from 'next/image';

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

            {groups.length === 0 && (
                <div className="text-center text-xl font-semibold text-secondary-1 dark:text-dark-primary-1">
                    Không có nhóm nào
                </div>
            )}
        </>
    );
};

export default GroupsPage;
