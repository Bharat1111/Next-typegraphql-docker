import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from 'cors'
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

import microConfig from "./mikro-orm.config";
import { __prod__ } from "./constants";
// import { post } from './entities/post'
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
  )
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: __prod__,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        sameSite: 'lax'
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ 
    app, 
    cors: false
  });

  app.listen(3001, () => {
    console.log("Server started on port 3001");
  });
};

main().catch((err) => {
  console.log(err);
});
