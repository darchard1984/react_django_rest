import { Flex, Text } from '@chakra-ui/react'

import AddCard from '../AddCard'
import ApiClient from '../../services/api'
import { Card } from '../AddCard/types'
import CardComponent from '../Card'
import { CardListPanelProps } from './types'
import { CloseIcon } from '@chakra-ui/icons'
import { Droppable } from 'react-beautiful-dnd'
import PanelIcon from '../PanelIcon'
import React from 'react'

const CardListPanel: React.FC<CardListPanelProps> = (props) => {
  const _renderCards = () => {
    const cards = props.cards as Card[]
    return cards.map((card, index) => (
      <CardComponent card={card} key={card.pk} index={index} />
    ))
  }

  const _handleCardListDelete = async (cardListId: number) => {
    const client = new ApiClient()

    const resp = await client.delete(
      `/card-list/${cardListId}/`,
      {
        headers: client.setAuthHeader(`${props.idToken}`),
      },
      props.setErrorState
    )

    if (resp.status === 204) {
      props.setBoardState(props.idToken)
    }
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
        alignItems="center"
        mb="2"
        justifyContent="space-between"
      >
        <Text as="span" wordBreak="break-word">
          {props.cardList.title}
        </Text>
        <PanelIcon
          onIconClick={_handleCardListDelete}
          pk={props.cardList.pk}
          icon={<CloseIcon />}
          ariaLabel="Delete card list"
        />
      </Flex>
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
    </Flex>
  )
}

export default CardListPanel
