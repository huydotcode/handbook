// "use client";
// import { Session } from "next-auth";
// import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
// import toast from "react-hot-toast";

// interface Props {
//   post?: Post;
//   comment?: Comment;
//   session: Session;
//   setReactions: Dispatch<SetStateAction<any>>;
// }

// interface Reaction {
//   type: string | undefined;
//   userId: string | undefined;
//   newSend: boolean;
// }

// export default function useReaction(props: Props) {
//   const { post, comment, session, setReactions } = props;

//   const [countSendReact, setCoutSendReact] = useState<number>(0);
//   const [warning, setWarning] = useState<boolean>(false);

//   // Trạng thái đã từng tương tác với post
//   const isReactState = useMemo(() => {
//     return (
//       post?.reactions.find((react) => react.userId === session?.user.id) ||
//       (comment?.reactions.find(
//         (react) => react.userId === session?.user.id
//       ) as ReactionType)
//     );
//   }, [post?.reactions, comment?.reactions, session?.user.id]);

//   // Khi chưa từng tương tác với post
//   const [react, setReact] = useState<Reaction>({
//     type: isReactState?.reactionType,
//     userId: isReactState?.userId,
//     newSend: false,
//   });

//   // Xử lí gửi cảm xúc
//   const sendReaction = (type: string | undefined): void => {
//     if (type === react?.type) {
//       // Hủy tương tác
//       setReact({
//         newSend: true,
//         type: undefined,
//         userId: session?.user.id,
//       });

//       if (setReactions) {
//         setReactions((prev: any) => {
//           return prev.filter(
//             (react: ReactionType) =>
//               react._id !== session.user.id && react.userId !== session.user.id
//           );
//         });
//       }
//     } else {
//       // Tương tác
//       setReact({
//         newSend: true,
//         type: type,
//         userId: session?.user.id,
//       });

//       if (setReactions) {
//         setReactions((prev: any) => {
//           return [
//             ...prev,
//             {
//               reactionType: react.type || "",
//               userId: react.userId || "",
//               _id: session.user.id,
//             },
//           ];
//         });
//       }
//     }
//   };

//   // Xử lí gửi req lên server
//   useEffect(() => {
//     if (react?.newSend && !warning) {
//       // Gửi req lên server
//       if (post) {
//         (async () => {
//           const res = await fetch(`/api/posts/${post?._id}/reaction`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               type: react.type,
//               userId: react.userId,
//             }),
//           });
//         })();
//       }

//       if (comment) {
//         (async () => {
//           const res = await fetch(
//             `/api/posts/${comment.postId}/comments/${comment._id}/reaction`,
//             {
//               method: "POST",
//               body: JSON.stringify({
//                 type: react.type,
//                 userId: react.userId,
//               }),
//             }
//           );
//         })();
//       }

//       setCoutSendReact((prev) => prev + 1);
//     }
//   }, [
//     post?._id,
//     session?.user.id,
//     comment,
//     post,
//     react,
//     isReactState,
//     warning,
//   ]);

//   // useEffect(() => {
//   //   if (countSendReact >= 20) {
//   //     toast.error(
//   //       "Tính năng bị khóa 1 phút vì bạn đã thả cảm xúc quá nhiều lần"
//   //     );
//   //     setWarning(true);
//   //   }
//   // }, [countSendReact]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setWarning(false);
//     }, 60000);

//     return () => clearTimeout(timer);
//   }, [warning]);

//   return { react, warning, sendReaction };
// }
