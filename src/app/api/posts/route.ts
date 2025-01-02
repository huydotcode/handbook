import { getAuthSession } from '@/lib/auth';
import { Group, Post, User } from '@/models';

const POPULATE_USER = 'name username avatar friends';
const POPULATE_GROUP = 'name avatar';

export const GET = async (request: Request, response: Response) => {
    const url = new URL(request.url);

    const page = url.searchParams.get('page') || 1;
    const pageSize = url.searchParams.get('pageSize') || 3;
    const groupId = url.searchParams.get('groupId');
    const userId = url.searchParams.get('userId');
    const username = url.searchParams.get('username');
    const type = url.searchParams.get('type');

    const query = {} as any;

    const session = await getAuthSession();

    if (userId !== 'undefined' || username !== 'undefined') {
        // Kiểm tra xem có phải là user đang đăng nhập không
        if (userId == session?.user.id || username == session?.user.username) {
            query.author = session?.user.id;
            query.option = {
                $in: ['public', 'private'],
            };
        } else {
            query.option = 'public';

            if (userId !== 'undefined' && userId) {
                query.author = userId;
            } else {
                const user = await User.findOne({ username });
                if (user) {
                    query.author = user.id;
                }
            }
        }
    }

    // Lấy những bài post trong group của user đang tham gia
    if (type == 'group' && groupId == 'undefined') {
        // Lấy những group mà user đang tham gia
        let groupsHasJoin = await Group.find({
            members: {
                $elemMatch: {
                    user: {
                        $eq: session?.user.id,
                    },
                },
            },
        });

        groupsHasJoin = groupsHasJoin.flatMap((group) => group._id);

        query.group = {
            $in: groupsHasJoin,
        };
    } else {
        if (groupId !== 'undefined') {
            query.group = groupId;
        }
    }

    try {
        let posts = await Post.find(query)
            .populate('author', POPULATE_USER)
            .populate('images')
            .populate('group', POPULATE_GROUP)
            .populate('loves', POPULATE_USER)
            .populate('shares', POPULATE_USER)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: POPULATE_USER,
                },
            })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 });

        // Nếu là chế độ chỉ bạn bè thì kiểm tra xem có phải là bạn bè không
        posts = posts.filter((post) => {
            if (post.option == 'friends') {
                if (post.author.friends.includes(session?.user.id)) {
                    return post;
                }
            } else {
                return post;
            }
        });

        return new Response(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        return new Response('Error', { status: 500 });
    }
};
