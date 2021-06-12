import { Query, Arg, Resolver, Mutation } from "type-graphql";
import { post } from "../entities/post";

@Resolver()
export class PostResolver {
  @Query(() => [post])
  posts(): Promise<post[]> {
    return post.find();
  }

  @Query(() => post, { nullable: true })
  post(@Arg("id") id: number): Promise<post | undefined> {
    return post.findOne(id);
  }

  @Mutation(() => post)
  async createPost(@Arg("title") title: string): Promise<post> {
    return post.create({ title }).save();
  }

  @Mutation(() => post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<post | null> {
    const Post = await post.findOne(id);

    if (!Post) {
      return null;
    }

    if (typeof title !== "undefined") {
      post.update({ id }, { title });
    }
    return Post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    post.delete(id);
    return true;
  }
}
