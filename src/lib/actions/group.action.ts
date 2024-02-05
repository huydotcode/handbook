'use server';
import Group from '@/models/Group';
import { getAuthSession } from '../auth';
import { Session } from 'next-auth';
import connectToDB from '@/services/mongoose';
import { Post } from '@/models';

export const createGroup = async ({
    name,
    description,
}: {
    name: string;
    description: string;
}) => {
    try {
        await connectToDB();
        const session = (await getAuthSession()) as Session;

        if (!session?.user) {
            return {
                msg: 'Bạn cần đăng nhập để thực hiện tính năng này!',
                success: false,
            };
        }

        const newGroup = await new Group({
            name,
            description,
            members: [session?.user.id],
            owner: session?.user.id,
        });

        await newGroup.save();

        return {
            msg: 'Tạo nhóm thành công!',
            success: true,
            data: JSON.parse(JSON.stringify(newGroup)),
        };
    } catch (error) {
        return {
            msg: 'Có lỗi xảy ra khi tạo nhóm, vui lòng thử lại sau!',
            success: false,
        };
    }
};

export const getGroups = async () => {
    try {
        await connectToDB();
        const session = (await getAuthSession()) as Session;

        if (!session?.user) {
            return {
                msg: 'Bạn cần đăng nhập để thực hiện tính năng này!',
                success: false,
            };
        }

        const groups = await Group.find({
            members: {
                $in: [session?.user.id],
            },
        });

        return {
            msg: 'Lấy danh sách nhóm thành công!',
            success: true,
            data: JSON.parse(JSON.stringify(groups)),
        };
    } catch (error) {
        return {
            msg: 'Có lỗi xảy ra khi lấy danh sách nhóm, vui lòng thử lại sau!',
            success: false,
        };
    }
};

export const getPostsOfGroup = async ({ groupId }: { groupId: string }) => {
    try {
        await connectToDB();
        const session = (await getAuthSession()) as Session;

        if (!session?.user) {
            return {
                msg: 'Bạn cần đăng nhập để thực hiện tính năng này!',
                success: false,
            };
        }

        const posts = await Post.find({
            group: groupId,
        });

        return {
            msg: 'Lấy danh sách bài viết thành công!',
            success: true,
            data: JSON.parse(JSON.stringify(posts)),
        };
    } catch (error) {
        return {
            msg: 'Có lỗi xảy ra khi lấy danh sách bài viết, vui lòng thử lại sau!',
            success: false,
        };
    }
};
