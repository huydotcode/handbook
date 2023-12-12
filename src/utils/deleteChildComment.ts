import Comment from '@/models/Comment';
// import Post from "@/models/Post";

export default async function deleteChildComments(commentId: string) {
    // Tìm và lấy tất cả các comment con của comment hiện tại
    const childComments = await Comment.find({ parent_id: commentId });

    // Lặp qua từng comment con và xóa nó cùng với các comment con của nó (nếu có)
    if (childComments.length === 0) return;

    for (const childComment of childComments) {
        if (!childComment) continue;

        await deleteChildComments(childComment._id);
        await Comment.findByIdAndDelete(childComment._id);

        await Comment.findByIdAndUpdate(commentId, {
            $pull: { replies: childComment._id },
        });
    }
}
