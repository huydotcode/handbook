import Post from "@/models/Post";
import connectToDB from "@/services/mongoose";
import logger from "@/utils/logger";

export const POST = async (req: Request, { params }: Params) => {
  const request = await req.json();
  const { postId } = params;

  const { userId, undo } = request;

  logger("API - POST: Send reaction to post");

  try {
    await connectToDB();

    const post = await Post.findById(postId);

    if (!post) {
      return new Response(`Post not found`, { status: 500 });
    }

    if (!userId) {
      return new Response(`User not found`, { status: 500 });
    }

    post.loves = post.loves.filter((item: any) => !item.equals(userId));
    if (!undo) post.loves.push(userId);
    await post.save();

    return new Response("Success to send reactions", { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(`Error with send reactions: ${error}`), {
      status: 500,
    });
  }
};
