import { Query } from "type-graphql";

// @Resolver
export class HelloResolver {
    @Query(() => String)
    hello() {
        return "hello World"
    }
}