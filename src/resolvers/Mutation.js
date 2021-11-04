import { Users, Posts } from "../db";
import { v4 as uuidv4 } from "uuid";

export default {
  createUser: (parent, args, { pubsub }, info) => {
    const { name, email, age } = args;
    console.log(name, email, age);
    const isEmailTaken = Users.some((user) => user.email === email);
    if (isEmailTaken) throw new Error("Email is taken");
    const newUser = {
      id: uuidv4(),
      name,
      email,
      age,
    };

    Users.push(newUser);
    pubsub.publish("users", { users: newUser });

    return newUser;
  },
  updatePost: (parent, args, ctx, info) => {
    const { id, data } = args;
    const isPostExist = Posts.some((post) => post.id === id);

    if (!isPostExist) throw new Error("Post not found");

    Posts = Posts.map((post) => {
      if (post.id === id) {
        return {
          ...post,
          ...data,
        };
      } else {
        return post;
      }
    });

    return Posts.find((post) => post.id === id);
  },
};
