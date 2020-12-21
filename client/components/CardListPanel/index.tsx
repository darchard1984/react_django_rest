import { Flex, Text } from '@chakra-ui/react'

import { CardListPanelProps } from './types'
import Cards from '../Cards'
import React from 'react'

const CardListPanel: React.FC<CardListPanelProps> = (props) => {
  return (
    <Flex
      width="225px"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      background="lightGrey"
      margin="2"
      borderRadius=".3rem"
      padding="2"
      key={props.cardList.pk}
    >
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
          {props.cardList.title}
        </Text>
      </Flex>

      <Cards
        cardList={props.cardList}
        idToken={props.idToken}
        cards={props.cards}
      />
    </Flex>
  )
}

export default CardListPanel
