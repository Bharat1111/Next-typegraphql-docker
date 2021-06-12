import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import {
  Button,
  Flex,
  Text,
  Heading,
  Box,
  Link,
  Stack,
} from "@chakra-ui/react";

import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useState } from "react";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  return (
    <Layout>
      <Flex align="centre">
        <Heading>Reddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>

      <hr />
      {fetching ? (
        <div>Loading...</div>
      ) : !data ? (
        <div>No Posts</div>
      ) : (
        <>
          <Stack mt={6} spacing={8}>
            {data!.posts.posts.map((p) => (
              <Box key={p.id} p={5} shadow="md" borderRadius='3px' borderColor='whitesmoke' borderWidth="1px">
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet + "...."}</Text>
              </Box>
            ))}
          </Stack>
          {data && data.posts.hasMore ? (
            <Flex>
              <Button
                onClick={() => {
                  setVariables({
                    limit: variables.limit,
                    cursor:
                      data.posts.posts[data.posts.posts.length - 1].createdAt,
                  });
                }}
                isLoading={fetching}
                m="auto"
                my={8}
              >
                load more
              </Button>
            </Flex>
          ) : null}
        </>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
