import { Ctx, Query, Arg, Resolver, Mutation } from "type-graphql";
import { post } from "../entities/post";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
    @Query(() => [post])
    posts(
        @Ctx() {em}: MyContext
    ): Promise<post[]> {
        return em.find(post, {});
    }
    
    @Query(() => post, { nullable: true })
    post(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext
    ): Promise<post | null> {
        return em.findOne(post, { id });
    }
    
    @Mutation(() => post)
    async createPost(
        @Arg('title') title: String,
        @Ctx() {em}: MyContext) {
            const Post = em.create(post, { title }); // mikroorm syntax
            await em.persistAndFlush(Post);
            return Post;
    }
    
    @Mutation(() => post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
        @Ctx() {em}: MyContext): Promise<post | null> {
            const Post = await em.findOne(post, {id})

            if(!Post) {
                return null
            }

            if(typeof title !== 'undefined') {
                Post.title = title
                await em.persistAndFlush(Post);
            }
            return Post;
    }
    
    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext
    ): Promise<boolean> {        
            // try {
                em.nativeDelete(post, {id})
                return true;
            // } catch (error) {
                // console.log(error)
            // }
    }
}