import { Box, Link, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";

const Navbar = () => {
  const [{ fetching: loading }, logout] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery();
  
  let body = null;

  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (<>
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
    </>)
  } else {
    body = (
      <Flex>
        <Box mr={3}>{data.me.username}</Box>
          <Button isLoading={loading} onClick={() => logout()} variant="link">Logout</Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Box ml={"auto"}>
        {body}
      </Box>
    </Flex>
  );
};

export default Navbar;
