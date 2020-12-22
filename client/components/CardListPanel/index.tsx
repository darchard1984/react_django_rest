import { CardListPanelProps, CardListPanelState } from './types'
import { Flex, Text } from '@chakra-ui/react'

import AddCard from '../AddCard'
import { Card } from '../AddCard/types'
import CardComponent from '../Card'
import { DragDropContext } from 'react-beautiful-dnd'
import { Droppable } from 'react-beautiful-dnd'
import React from 'react'

const CardListPanel: React.FC<CardListPanelProps> = (props) => {
  function _renderCards() {
    const cards = props.cards as Card[]
    return cards.map((card, index) => (
      <CardComponent card={card} key={card.pk} index={index} />
    ))
  }

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

      <DragDropContext onDragEnd={props.onDragEnd}>
        <Droppable droppableId={props.cardList.pk.toString()}>
          {(provided) => (
            <Flex
              flexDirection="column"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {_renderCards()}
              {provided.placeholder}
              <AddCard
                cardListId={props.cardList.pk}
                idToken={props.idToken}
                setBoardState={props.setBoardState}
                nextPosition={props.cards.length}
              />
            </Flex>
          )}
        </Droppable>
      </DragDropContext>
    </Flex>
  )
}

export default CardListPanel
