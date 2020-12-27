import { Divider, Flex, Text, background } from '@chakra-ui/react'
import React, { useState } from 'react'

import ApiClient from '../../services/api'
import { CardComponentProps } from './types'
import { CloseIcon } from '@chakra-ui/icons'
import { Draggable } from 'react-beautiful-dnd'
import { FaEdit } from 'react-icons/fa'
import PanelIcon from '../PanelIcon'

const CardComponent: React.FC<CardComponentProps> = (props) => {
  const [showEditForm, _setShowEditForm] = useState(false)

  const _handleCardDelete = async (cardId: number) => {
    const client = new ApiClient()

    const resp = await client.delete(
      `/card/${cardId}/`,
      {
        headers: client.setAuthHeader(`${props.idToken}`),
      },
      props.setErrorState
    )

    if (resp.status === 204) {
      props.setBoardState(props.idToken)
    }
  }

  const _handleCardEdit = (pk: number) => {
    console.log('EDITING', pk)
  }
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
          <Flex justifyContent="space-between" width="100%">
            <Text fontWeight="bold">{props.card.title}</Text>
            <Flex color="white">
              <PanelIcon
                onIconClick={_handleCardEdit}
                pk={props.card.pk}
                icon={<FaEdit />}
                ariaLabel="Edit card"
                background="#000"
                color="white"
                _hover={{ background: '#000' }}
              />
              <PanelIcon
                onIconClick={_handleCardDelete}
                pk={props.card.pk}
                icon={<CloseIcon />}
                ariaLabel="Delete card"
                background="#000"
                color="white"
                _hover={{ background: '#000' }}
              />
            </Flex>
          </Flex>

          <Divider mt="2" mb="4" />
          <Text fontSize="xs">{props.card.description}</Text>
        </Flex>
      )}
    </Draggable>
  )
}
export default CardComponent
