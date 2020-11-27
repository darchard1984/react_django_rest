import { Flex, Text } from '@chakra-ui/react'

import { CardListPanelProps } from './types'
import React from 'react'

const CardListPanel: React.FC<CardListPanelProps> = (props) => {
  return (
    <Flex
      background="black"
      minWidth="200px"
      width="200px"
      minHeight="50px"
      flexWrap="nowrap"
      mt="8"
      color="white"
      padding="2"
      borderRadius=".3rem"
      ml="4"
      alignItems="center"
    >
      <Text as="span" wordBreak="break-word">
        {props.cardListTitle}
      </Text>
    </Flex>
  )
}

export default CardListPanel
