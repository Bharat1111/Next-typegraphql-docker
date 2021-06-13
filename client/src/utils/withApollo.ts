import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createWithApollo } from './createWithApollo'
import { PaginatedPosts } from "../generated/graphql";
import { NextPageContext } from "next";

const createClient = (ctx: NextPageContext) => new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  credentials: "include",
  headers: {
    cookie: (typeof window === "undefined" ? ctx.req.headers.cookie : undefined) || ''
  },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(existing: PaginatedPosts | undefined, incoming: PaginatedPosts): PaginatedPosts {
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts]
              }
            }
          }
        }
      }
    }
  }),
})

export const withApollo = createWithApollo(createClient)