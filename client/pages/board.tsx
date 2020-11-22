import React from 'react'

import { Flex, Box } from '@chakra-ui/react'
import ApiClient from '../services/api'

const client = new ApiClient()

class Board extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Box>
        <Flex justifyContent="center" mt="8" position="absolute" width="100%">
          Board
        </Flex>
      </Box>
    )
  }
}

export default Board
