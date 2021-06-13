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
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { UpdootSection } from "../components/UpdootSection";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  // const [variables, setVariables] = useState({
  //   limit: 15,
  //   cursor: null as null | string,
  // });

  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null 
    },
    // notifyOnNetworkStatusChange: true,
  });

  return (
    <Layout>
      {loading ? (
        <div>Loading...</div>
      ) : !data ? (
        <div>No Posts</div>
      ) : (
        <>
          <Stack mt={6} spacing={8}>
            {data!.posts.posts.map((p) =>
              !p ? null : (
                <Flex
                  key={p.id}
                  p={5}
                  shadow="lg"
                  borderRadius="3px"
                  borderColor="whitesmoke"
                  borderWidth="2px"
                >
                  <UpdootSection post={p} />
                  <Box flex={1}>
                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl">{p.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text>posted by {p.creator.username}</Text>
                    <Flex align="center">
                      <Text flex={1} mt={4}>
                        {p.textSnippet + "...."}
                      </Text>
                      <Box ml="auto">
                        <EditDeletePostButtons
                          id={p.id}
                          creatorId={p.creator.id}
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              )
            )}
          </Stack>
          {data && data.posts.hasMore ? (
            <Flex>
              <Button
                onClick={() => {
                  fetchMore({
                    variables: {
                      limit: variables?.limit,
                      cursor:
                        data.posts.posts[data.posts.posts.length - 1].createdAt,
                    },
                  })
                }}
                isLoading={loading}
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

export default withApollo({ ssr: true })(Index)
