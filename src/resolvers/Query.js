import { Users } from "../db";

export default {
  users: (parent, args, ctx, info) => {
    const { userId, query } = args;
    if (!userId && !query) return Users;
    if (userId) return Users.filter((user) => user.id === userId);
    if (query)
      return Users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
  },
  posts: () => Posts,
  add: (parent, args, ctx, info) => {
    const { numbers } = args;
    return numbers.reduce(
      (accumulator, current) => (accumulator += current),
      0
    );
  },
};
