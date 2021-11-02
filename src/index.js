import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

// Demo data

const Comments = [
  {
    id: "1",
    postId: "1",
    userId: "2",
    comment: "This post is disaster",
  },
  {
    id: "2",
    postId: "1",
    userId: "3",
    comment: "This post is really cool",
  },
  {
    id: "3",
    postId: "3",
    userId: "1",
    comment: "This post is not so cool",
  },
];

const Users = [
  {
    id: "1",
    name: "muneeb",
    email: "muneeb@example.com",
    age: 22,
  },
  {
    id: "2",
    name: "mujeeb",
    email: "mujeeb@example.com",
    age: 30,
  },
  {
    id: "3",
    name: "fazil",
    email: "fazil@example.com",
    age: 24,
  },
];

let Posts = [
  {
    id: "1",
    title: "This first title",
    description: "No description available",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "This second title",
    description: "No description available",
    published: false,
    author: "2",
  },
  {
    id: "3",
    title: "This second title",
    description: "No description available",
    published: false,
    author: "3",
  },
  {
    id: "4",
    title: "This second title",
    description: "No description available",
    published: false,
    author: "3",
  },
];

// Scalar Types: String, Float, Int, Boolean, ID

const gql = String.raw;

const typeDefs = gql`
  type Query {
    users(userId: ID, query: String): [User!]
    posts: [Post!]
    add(numbers: [Float!]!): Float!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int!): User!
    updatePost(id: ID!, data: UpdatePostInput!): Post!
  }

  input UpdatePostInput {
    title: String
    description: String
    published: Boolean
  }

  type User {
    id: ID!
    email: String!
    name: String!
    age: Int!
    posts: [Post!]
  }

  type Post {
    id: ID!
    title: String!
    description: String!
    published: Boolean!
    author: User!
    comments: [Comment!]
  }

  type Comment {
    id: ID!
    comment: String!
    author: User!
  }
`;

const resolvers = {
  Query: {
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
  },
  Mutation: {
    createUser: (parent, args, ctx, info) => {
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
  },
  Post: {
    author: (parent, args, ctx, info) => {
      const { author } = parent;
      return Users.find((user) => user.id === author);
    },
    comments: (parent, args, ctx, info) => {
      const { id } = parent;
      return Comments.filter((comment) => comment.postId === id);
    },
  },
  User: {
    posts: (parent, args, ctx, info) => {
      const { id } = parent;
      return Posts.filter((post) => post.author === id);
    },
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      const { userId } = parent;
      return Users.find((user) => user.id === userId);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.start({ port: 3000 }, () => {
  console.log("GraphQL server has been started http://localhost:3000");
});
