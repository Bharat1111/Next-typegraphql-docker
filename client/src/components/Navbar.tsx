import { Box, Link, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

const Navbar = () => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (<>
      <NextLink href="/login">
        <Link color="whitesmoke" mr={2}>
          login
        </Link>
      </NextLink>
      <NextLink href="/register">
        <Link color="whitesmoke" mr={2}>
          register
        </Link>
      </NextLink>
    </>)
  } else {
    body = (
      <Flex>
        <Box mr={3}>{data.me.username}</Box>
        <Button variant="link">Logout</Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tan" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
