import { Flex, Box } from '@chakra-ui/react'

const Nav: React.FC = () => {
  return (
    <Flex
      as="nav"
      fontFamily="system"
      fontWeight="bold"
      fontSize="md"
      width="100%"
      height="60px"
      justifyContent="flex-start"
      alignItems="center"
      boxShadow="5px -8px 15px 5px rgba(0,0,0,0.22)"
    >
      <Box ml="8">Lystly</Box>
    </Flex>
  )
}

export default Nav
