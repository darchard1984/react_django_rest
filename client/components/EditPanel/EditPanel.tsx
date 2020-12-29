import { EditPanelProps } from './types'
import { Flex } from '@chakra-ui/react'
import React from 'react'

const EditPanel: React.FC<EditPanelProps> = (props) => {
  return (
    <Flex
      display={props.display ? 'flex' : 'none'}
      width="100vw"
      position="absolute"
      top="0"
      left="0"
      bottom="0"
      height="100vh"
      background="mask"
      zIndex="10"
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        zIndex="11"
        background="#fff"
        position="relative"
        top="-100px"
        borderRadius=".3rem"
      >
        {props.children}
      </Flex>
    </Flex>
  )
}

export default EditPanel
