import {
    createGroup,
    deleteGroup,
    getGroupByGroupId,
    getGroupsByUserId,
    getMembersByGroupId,
    getRecommendGroups,
    joinGroup,
    leaveGroup,
    updateAvatar,
    updateCoverPhoto,
    updateGroup,
} from '../actions/group.action';

interface IGroupService {
    create: ({
        name,
        description,
        avatar,
        type,
        members,
    }: {
        name: string;
        description: string;
        avatar: string;
        type: string;
        members: string[];
    }) => Promise<IGroup>;
    getById: (groupId: string) => Promise<IGroup>;
    getByUserId: ({
        userId,
        page,
        pageSize,
    }: {
        userId: string;
        page: number;
        pageSize: number;
    }) => Promise<IGroup[]>;
    getRecommendedGroups: (userId: string) => Promise<IGroup[]>;
    getMembers: (groupId: string) => Promise<IMemberGroup[]>;

    updateCoverPhoto: ({
        groupId,
        coverPhoto,
        path,
    }: {
        groupId: string;
        coverPhoto: string;
        path: string;
    }) => Promise<void>;
    updateAvatar: ({
        groupId,
        avatarId,
        path,
    }: {
        groupId: string;
        avatarId: string;
        path: string;
    }) => Promise<void>;
    update: ({
        groupId,
        name,
        description,
        type,
        path,
    }: {
        groupId: string;
        name: string;
        description: string;
        type: string;
        path?: string;
    }) => Promise<void>;

    join: ({
        groupId,
        userId,
    }: {
        groupId: string;
        userId: string;
    }) => Promise<void>;
    leave: ({
        groupId,
        userId,
        path,
    }: {
        groupId: string;
        userId: string;
        path?: string;
    }) => Promise<void>;
    delete: (groupId: string) => Promise<void>;
}

class GroupServiceClass implements IGroupService {
    public async create({
        name,
        description,
        avatar,
        type,
        members,
    }: {
        name: string;
        description: string;
        avatar: string;
        type: string;
        members: string[];
    }) {
        const newGroup = await createGroup({
            name,
            description,
            avatar,
            type,
            members,
        });

        return newGroup;
    }

    public async getById(groupId: string): Promise<IGroup> {
        const group = await getGroupByGroupId({
            groupId,
        });

        return group;
    }

    public async getByUserId({
        userId,
        page,
        pageSize,
    }: {
        userId: string;
        page: number;
        pageSize: number;
    }) {
        const groups = await getGroupsByUserId({
            userId,
            page,
            pageSize,
        });

        return groups;
    }

    public async getRecommendedGroups(userId: string) {
        const groups = await getRecommendGroups({
            userId,
        });

        return groups;
    }

    public async getMembers(groupId: string): Promise<IMemberGroup[]> {
        const members = await getMembersByGroupId({
            groupId,
        });

        return members;
    }

    public async updateCoverPhoto({
        groupId,
        coverPhoto,
        path,
    }: {
        groupId: string;
        coverPhoto: string;
        path: string;
    }) {
        await updateCoverPhoto({
            groupId,
            coverPhoto,
            path,
        });
    }

    public async updateAvatar({
        groupId,
        avatarId,
        path,
    }: {
        groupId: string;
        avatarId: string;
        path: string;
    }) {
        await updateAvatar({
            groupId,
            avatarId,
            path,
        });
    }

    public async update({
        groupId,
        name,
        description,
        type,
        path,
    }: {
        groupId: string;
        name: string;
        description: string;
        type: string;
        path?: string;
    }) {
        await updateGroup({
            description,
            groupId,
            name,
            type,
            path,
        });
    }

    public async join({
        groupId,
        userId,
    }: {
        groupId: string;
        userId: string;
    }) {
        await joinGroup({
            groupId,
            userId,
        });
    }

    public async leave({
        groupId,
        userId,
        path,
    }: {
        groupId: string;
        userId: string;
        path?: string;
    }) {
        await leaveGroup({
            groupId,
            userId,
            path,
        });
    }

    public async delete(groupId: string) {
        await deleteGroup({
            groupId,
        });
    }
}

const GroupService = new GroupServiceClass();
export default GroupService;
