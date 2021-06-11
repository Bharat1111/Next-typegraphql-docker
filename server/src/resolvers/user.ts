import { Users } from "../entities/User";
import { MyContext } from "src/types";
import {
  Ctx,
  Arg,
  Resolver,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class Error {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field(() => Users, { nullable: true })
  user?: Users;
}

@Resolver()
export class UserResolver {
  @Query(() => Users, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(Users, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") { username, password }: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ) {
    if (username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username must be greater than 2 letters",
          },
        ],
      };
    }

    if (password.length <= 6) {
      return {
        errors: [
          {
            field: "password",
            message: "password must be greater than 6 letters",
          },
        ],
      };
    }

    const hashpassword = await argon2.hash(password);

    const user = await em.findOne(Users, { username });
    if (user) {
      return {
        errors: [
          {
            field: "username",
            message: "Username already exists",
          },
        ],
      };
    } else {
      const newUser = em.create(Users, { username, password: hashpassword });

      await em.persistAndFlush(newUser);
      // console.log('user: ', user)
      req.session.userId = newUser.id;
      return { user };
    }


  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") { username, password }: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ) {
    const user = await em.findOne(Users, { username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Username doen't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect Password",
          },
        ],
      };
    }

    req.session!.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    
    return new Promise(resolve =>  req.session.destroy(
      err => {
        if(err) {
          console.log(err)
          resolve(false)
          return
        }
        
        res.clearCookie(COOKIE_NAME)
        resolve(true)
      }
    ))
  }
}
