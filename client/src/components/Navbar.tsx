import { useApolloClient } from "@apollo/client";
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from 'next/router'

import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";

const Navbar = () => {
  const Router = useRouter()
  const [logout, { loading }] = useLogoutMutation();
  const apolloClient = useApolloClient()
  const { data, loading: fetching } = useMeQuery({
    skip: isServer()
  });

  let body = null;

  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="whitesmoke" mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="whitesmoke" mr={2}>
            Register
          </Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align='center'>
        <NextLink href="/create-post">
          <Button mr={4}>
          <Link mr={2}>Create Post</Link>
          </Button>
        </NextLink>
        <Box mr={3}>{data.me.username}</Box>
        <Button isLoading={loading} onClick={async () => {
          await logout()
          await apolloClient.resetStore()
        }} variant="link">
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex  flex={1} m='auto' align='center' maxWidth={800}>
      <NextLink href="/">
        <Link>
          <Heading>LiReddit</Heading>
        </Link>
      </NextLink>
      <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
