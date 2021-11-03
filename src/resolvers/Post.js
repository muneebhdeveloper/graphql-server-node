import { Users, Comments } from "../db";

export default {
  author: (parent, args, ctx, info) => {
    const { author } = parent;
    return Users.find((user) => user.id === author);
  },
  comments: (parent, args, ctx, info) => {
    const { id } = parent;
    return Comments.filter((comment) => comment.postId === id);
  },
};
