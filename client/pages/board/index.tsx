import React from 'react'
import { Flex, Box } from '@chakra-ui/react'

class Board extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Flex
        fontFamily="system"
        fontWeight="bold"
        fontSize="md"
        width="100%"
        height="60px"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box ml="8">Board</Box>
      </Flex>
    )
  }
}

export default Board
