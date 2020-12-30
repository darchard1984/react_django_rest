import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

import AddCard from '../AddCard'
import ApiClient from '../../services/ApiClient'
import { Card } from '../AddCard/types'
import CardComponent from '../CardPanel'
import { CardListPanelProps } from './types'
import { CloseIcon } from '@chakra-ui/icons'
import { Droppable } from 'react-beautiful-dnd'
import EditCardListForm from '../EditCardListForm'
import { FaEdit } from 'react-icons/fa'
import PanelIcon from '../PanelIcon'

const CardListPanel: React.FC<CardListPanelProps> = (props) => {
  const [showEditForm, _setShowEditForm] = useState(false)

  const _renderCards = (props: CardListPanelProps) => {
    const cards = props.cards as Card[]
    return cards.map((card, index) => (
      <Box key={card.pk}>
        <CardComponent
          card={card}
          index={index}
          idToken={props.user.idToken}
          setErrorState={props.setErrorState}
          setBoardState={props.setBoardState}
        />
      </Box>
    ))
  }

  const _handleCardListDelete = async (cardListId: number) => {
    const client = new ApiClient()

    const resp = await client.request(
      'DELETE',
      `/card-list/${cardListId}/`,
      {
        headers: client.setAuthHeader(`${props.user.idToken}`),
      },
      props.setErrorState
    )

    if (resp.status === 204) {
      props.setBoardState(props.user.idToken)
    }
  }

  const _handleCardListEdit = (cardListId: number) => {
    _setShowEditForm(true)
  }

  return (
    <Flex
      maxWidth="225px"
      flexDirection="column"
      flexGrow={1}
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
        alignItems="flex-start"
        mb="2"
        justifyContent="space-between"
      >
        <Text as="span" wordBreak="break-word">
          {props.cardList.title}
        </Text>
        <Flex>
          <PanelIcon
            onIconClick={_handleCardListEdit}
            pk={props.cardList.pk}
            icon={<FaEdit />}
            ariaLabel="Edit card list"
          />
          <PanelIcon
            onIconClick={_handleCardListDelete}
            pk={props.cardList.pk}
            icon={<CloseIcon />}
            ariaLabel="Delete card list"
          />
        </Flex>
      </Flex>
      <EditCardListForm
        display={showEditForm}
        cardList={props.cardList}
        idToken={props.user.idToken}
        setShowEditFormState={_setShowEditForm}
        setBoardState={props.setBoardState}
        setErrorState={props.setErrorState}
      />
      <Droppable droppableId={props.cardList.pk.toString()}>
        {(provided) => (
          <Flex
            flexDirection="column"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {_renderCards(props)}
            {provided.placeholder}
            <AddCard
              cardListId={props.cardList.pk}
              idToken={props.user.idToken}
              setBoardState={props.setBoardState}
              nextPosition={props.cards.length}
            />
          </Flex>
        )}
      </Droppable>
    </Flex>
  )
}

export default CardListPanel
