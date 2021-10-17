import { GraphQLServer } from "graphql-yoga";

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
    age: 22,
  },
  {
    id: "2",
    name: "mujeeb",
    age: 30,
  },
  {
    id: "3",
    name: "fazil",
    age: 24,
  },
];

const Posts = [
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

  type User {
    id: ID!
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
