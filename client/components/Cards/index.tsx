import { CardsProps, CardsState } from './types'
import { Divider, Flex, Text } from '@chakra-ui/react'

import AddCard from '../AddCard'
import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'
import React from 'react'

export class Cards extends React.Component<CardsProps, CardsState> {
  client = new ApiClient()
  constructor(props) {
    super(props)
    this.state = {
      cards: [],
    }
  }

  async componentDidMount() {
    const cards = await this.getCards(
      this.props.cardList.cards,
      this.props.idToken
    )
    this.setState({
      cards: cards.data,
    })
  }

  async getCards(
    cardIds: number[],
    idToken: string
  ): Promise<AxiosResponse<Card[]>> {
    const ids = cardIds.join(',')
    const resp: AxiosResponse<Card[]> = await this.client.get(
      `/cards/?pks=${ids}`,
      {
        headers: this.client.setAuthHeader(idToken),
      }
    )

    return resp
  }

  async getCardList(cardListId: number): Promise<AxiosResponse<CardList>> {
    const resp: AxiosResponse<CardList> = await this.client.get(
      `/card-list/${cardListId}/`,
      { headers: this.client.setAuthHeader(this.props.idToken) }
    )

    return resp
  }

  setCardState = async (cardListId: number) => {
    const cardList = await this.getCardList(cardListId)
    const cards = await this.getCards(cardList.data.cards, this.props.idToken)
    this.setState({
      cards: cards.data,
    })
  }

  render() {
    return (
      <Flex flexDirection="column">
        {this.state.cards.map((card) => (
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
            background="boardBackground"
            key={card.pk}
          >
            <Text fontWeight="bold">{card.title}</Text>
            <Divider mt="2" mb="4" />
            <Text fontSize="xs">{card.description}</Text>
          </Flex>
        ))}
        <AddCard
          cardListId={this.props.cardList.pk}
          idToken={this.props.idToken}
          setCardState={this.setCardState}
        />
      </Flex>
    )
  }
}

export default Cards
