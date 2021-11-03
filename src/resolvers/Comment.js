import { Users } from "../db";

export default {
  author: (parent, args, ctx, info) => {
    const { userId } = parent;
    return Users.find((user) => user.id === userId);
  },
};
