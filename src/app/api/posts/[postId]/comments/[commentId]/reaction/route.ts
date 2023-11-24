import Comment from "@/models/Comment";
import Post from "@/models/Post";
import connectToDB from "@/services/mongoose";
import logger from "@/utils/logger";

export const POST = async (req: Request, { params }: Params) => {
  const request = await req.json();
  const { postId, commentId } = params;
  const { type, userId } = request;
  logger("API - POST: Send reaction to comment");

  try {
    await connectToDB();

    const post = await Post.findById(postId);
    const comment = await Comment.findById(commentId);

    if (!post) {
      return new Response(`Post not found`, { status: 500 });
    }

    if (!comment) {
      return new Response(`Comment not found`, { status: 500 });
    }

    // Khi hủy
    if (!type) {
      comment.reactions = comment.reactions.filter(
        (item: any) => !item.userId.equals(userId)
      );
      // comment.reactions = comment.reactions.filter(
      //   (item: any) => !item.userId.equals(userId)
      // );
    }

    // Khi thả cảm xúc
    if (type) {
      const isReact: ReactionType | undefined = comment.reactions.find(
        (item: any) => item.userId.equals(userId)
      );

      if (isReact && isReact.reactionType !== type) {
        comment.reactions = comment.reactions.filter(
          (item: any) => !item.userId.equals(userId)
        );
      }

      comment.reactions.push({
        userId,
        reactionType: type,
      });
    }

    await comment.save();

    return new Response("Success to send reactions", { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(`Error with send reactions: ${error}`), {
      status: 500,
    });
  }
};
