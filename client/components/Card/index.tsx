import { Box, Divider, Flex, Text } from '@chakra-ui/react'

import { CardComponentProps } from './types'
import { Draggable } from 'react-beautiful-dnd'
import React from 'react'

const CardComponent: React.FC<CardComponentProps> = (props) => {
  return (
    <Draggable draggableId={props.card.pk.toString()} index={props.index}>
      {(provided) => (
        <Flex
          color="white"
          mb="4"
          width="200px"
          justifyContent="flex-start"
          alignItems="flex-start"
          flexDirection="column"
          borderRadius=".3rem"
          padding="4"
          wordBreak="break-word"
          background="cardBackground"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Text fontWeight="bold">{props.card.title}</Text>
          <Divider mt="2" mb="4" />
          <Text fontSize="xs">{props.card.description}</Text>
        </Flex>
      )}
    </Draggable>
  )
}
export default CardComponent
