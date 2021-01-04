import { Box, Flex, Link } from '@chakra-ui/react'

import React from 'react'

const Nav: React.FC = () => {
  return (
    <Flex
      as="nav"
      fontFamily="system"
      fontWeight="bold"
      fontSize="md"
      width="100%"
      height="60px"
      justifyContent="center"
      alignItems="center"
      boxShadow="5px -8px 15px 5px rgba(0,0,0,0.22)"
      background="#151515"
    >
      <Link href="/">
        <Box color="#fff">Lystly</Box>
      </Link>
    </Flex>
  )
}

export default Nav
