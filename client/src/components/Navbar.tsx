import { Box, Link, Flex } from '@chakra-ui/react'
import NextLink from 'next/link'

const Navbar = () => {
    return (
        <Flex bg='tomato' p={4}>
            <Box ml={'auto'}>
                <NextLink href='/login'>
                    <Link color='whitesmoke' mr={2}>login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link color='whitesmoke' mr={2}>register</Link>
                </NextLink>
            </Box>
        </Flex>
    )
}
  
  export default Navbar
  