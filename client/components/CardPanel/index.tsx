import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

import ApiClient from '../../services/ApiClient'
import { CardPanelProps } from './types'
import { CloseIcon } from '@chakra-ui/icons'
import { Draggable } from 'react-beautiful-dnd'
import EditCardForm from '../EditCardForm'
import { FaEdit } from 'react-icons/fa'
import PanelIcon from '../PanelIcon'

const CardPanel: React.FC<CardPanelProps> = (props) => {
  const [showEditForm, _setShowEditFormState] = useState(false)

  const _deleteCard = async (cardId: number) => {
    const client = new ApiClient()

    const resp = await client.request(
      'DELETE',
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
    _setShowEditFormState(true)
  }
  return (
    <Box>
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
            <Flex
              justifyContent="space-between"
              width="100%"
              alignItems="flex-start "
            >
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
                  onIconClick={_deleteCard}
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
      <EditCardForm
        display={showEditForm}
        card={props.card}
        idToken={props.idToken}
        setShowEditFormState={_setShowEditFormState}
        setBoardState={props.setBoardState}
        setErrorState={props.setErrorState}
      />
    </Box>
  )
}
export default CardPanel
