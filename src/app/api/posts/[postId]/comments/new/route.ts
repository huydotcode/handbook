import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";
import connectToDB from "@/services/mongoose";
import logger from "@/utils/logger";

export const POST = async (req: Request, { params }: Params) => {
  logger("API - POST: Send comment to post");
  const request = await req.json();
  const { postId } = params;
  const { content, userId, replyTo } = request;

  try {
    await connectToDB();
    // const post = await Post.findById(postId);
    const user = (await User.findById(userId)) as User;

    // if (!post) {
    //   return new Response(`Post not found`, { status: 500 });
    // }

    if (!user) {
      return new Response(`User not found`, { status: 500 });
    }

    const comment = {
      content: content,
      userInfo: {
        id: user.id,
        image: user.image,
        name: user.name,
      },
      parentCommentId: replyTo || null,
      postId: postId,
    };
    const newComment = new Comment(comment);
    // post.comments.push(newComment._id);

    if (replyTo) {
      const parentComment = await Comment.findById(replyTo);
      parentComment.replies.push(newComment._id);
      await parentComment.save();
    }

    // await post.save();
    await newComment.save();
    return new Response(JSON.stringify(newComment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(`Error with send comment: ${error}`), {
      status: 500,
    });
  }
};
