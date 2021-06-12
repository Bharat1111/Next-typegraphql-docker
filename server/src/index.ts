import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from 'cors'
import session from "express-session";
import connectRedis from "connect-redis";
import { createConnection } from 'typeorm'

import { COOKIE_NAME, __prod__ } from "./constants";
// import { post } from './entities/post'
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { redis } from "./redis";
import { post } from "./entities/post";
import { Users } from "./entities/User";

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'lireddit',
    username: 'postgres',
    password: 'lsg@11_',
    logging: true,
    synchronize: true,
    entities: [post, Users]
  })

  const app = express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
  )
  app.use(
    session({
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      name: COOKIE_NAME,
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
    context: ({ req, res }) => ({ req, res }),
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
