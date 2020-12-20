import { Flex, Text } from '@chakra-ui/react'

import { CardListPanelProps } from './types'
import React from 'react'

const CardListPanel: React.FC<CardListPanelProps> = (props) => {
  return (
    <Flex
      width="200px"
      flexWrap="nowrap"
      color="#000"
      fontWeight="bold"
      borderRadius=".3rem"
      alignItems="center"
      mb="2"
    >
      <Text as="span" wordBreak="break-word">
        {props.cardListTitle}
      </Text>
    </Flex>
  )
}

export default CardListPanel
