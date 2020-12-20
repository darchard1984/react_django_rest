import { CardsProps, CardsState } from './types'
import { Divider, Flex, Text } from '@chakra-ui/react'

import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import { Card } from '../AddCard/types'
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
    const cards = await this.getCards(this.props.cardIds, this.props.idToken)
    this.setState(
      {
        cards: cards?.data,
      },
      () => console.log(this.state)
    )
  }

  async getCards(
    cardIds: number[],
    idToken: string
  ): Promise<AxiosResponse<Card[]> | undefined> {
    const ids = cardIds.join(',')
    const resp: AxiosResponse<Card[]> | undefined = await this.client.get(
      `/cards/?pks=${ids}`,
      {
        headers: this.client.setAuthHeader(idToken),
      }
    )

    return resp
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
          >
            <Text fontWeight="bold">{card.title}</Text>
            <Divider mt="2" mb="4" />
            <Text fontSize="xs">{card.description}</Text>
          </Flex>
        ))}
      </Flex>
    )
  }
}

export default Cards
