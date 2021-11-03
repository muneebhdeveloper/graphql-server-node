import { Posts } from "../db";

export default {
  posts: (parent, args, ctx, info) => {
    const { id } = parent;
    return Posts.filter((post) => post.author === id);
  },
};
