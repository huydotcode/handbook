import connectToDB from "@/services/mongoose";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import logger from "@/utils/logger";
import deleteChildComments from "@/utils/deleteChildComment";

export const GET = async (req: Request, { params }: Params) => {
  const { commentId } = params;
  try {
    await connectToDB();
    const comment = await Comment.findById(commentId);

    return new Response(JSON.stringify(comment), { status: 201 });
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: Params) => {
  const { postId, commentId } = params;
  logger("API - DELETE: Delete comment post");

  if (!postId || !commentId) {
    return new Response("Id has value undefined", { status: 500 });
  }

  try {
    await connectToDB();

    // Xóa cmt trong db
    await deleteChildComments(commentId);
    const comment = await Comment.findByIdAndRemove(commentId);

    // Xóa id comment trong parent comment
    if (comment.parentComentId) {
      const parentComment = await Comment.findById(comment.parentComentId);

      if (parentComment.replies.length > 0) {
        parentComment.replies = parentComment.replies.filter(
          (id: string) => id !== commentId
        );
      }

      await parentComment.save();
    }

    return new Response(JSON.stringify("Success to delete comment:"), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Error with delete comment: ${error}`, {
      status: 500,
    });
  }
};
