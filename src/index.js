import { GraphQLServer } from "graphql-yoga";

// Demo data

const Users = [
  {
    id: "12356",
    name: "muneeb",
    age: 12,
  },
  {
    id: "12326",
    name: "mujeeb",
    age: 12,
  },
];

const Posts = [
  {
    id: "12356",
    title: "This first title",
    description: "No description available",
    published: true,
  },
  {
    id: "1233356",
    title: "This second title",
    description: "No description available",
    published: false,
  },
];

// Scalar Types: String, Float, Int, Boolean, ID

const gql = String.raw;

const typeDefs = gql`
  type Query {
    user(userId: ID, query: String): [User!]
    post: [Post!]
    add(numbers: [Float!]!): Float!
  }

  type User {
    id: ID!
    name: String!
    age: Int!
  }

  type Post {
    id: ID!
    title: String!
    description: String!
    published: Boolean!
  }
`;

const resolvers = {
  Query: {
    user: (parent, args, ctx, info) => {
      const { userId, query } = args;
      if (!userId && !query) return Users;
      if (userId) return Users.filter((user) => user.id === userId);
      if (query)
        return Users.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
    },
    post: () => Posts,
    add: (parent, args, ctx, info) => {
      const { numbers } = args;
      return numbers.reduce(
        (accumulator, current) => (accumulator += current),
        0
      );
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
