import { GraphQLServer, PubSub } from "graphql-yoga";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import Subscription from "./resolvers/Subscription";

// Scalar Types: String, Float, Int, Boolean, ID

const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Post,
  Subscription,
  User,
  Comment,
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: resolvers,
  context: {
    pubsub,
  },
});

server.start({ port: 3000 }, () => {
  console.log("GraphQL server has been started http://localhost:3000");
});
