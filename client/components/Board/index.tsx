import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react'
import { BoardProps, BoardState } from './types'
import authenticate, { signIn } from '../../lib/authenticate'

import AddCardList from '../AddCardList'
import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import { Board } from '../AddBoard/types'
import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'
import CardListPanel from '../CardListPanel'
import { Console } from 'console'
import React from 'react'
import { array } from 'yup'
import { withRouter } from 'next/router'

class BoardComponent extends React.Component<BoardProps, BoardState> {
  client = new ApiClient()
  constructor(props: BoardProps) {
    super(props)
    this.state = {
      user: {
        idToken: '',
        uid: '',
        pk: null,
        boards: [],
      },
      board: {
        card_lists: [],
        created_at: '',
        updated_at: '',
        pk: null,
        user: null,
        title: '',
      },
      cardLists: [],
      cards: [],
      showSpinner: true,
      errors: {
        requestError: {
          status: false,
          message: 'It looks like something went wrong, please try again later',
        },
      },
    }
  }

  async componentDidMount() {
    if (!this.state.user.pk) {
      let currentUser = await signIn()

      if (!currentUser) {
        this.props.router.push('/')
        return
      }

      const authenticated = await authenticate(
        currentUser,
        this.setRequestErrorState.bind(this)
      )

      if (
        authenticated.status === 200 &&
        authenticated.data.firebase_uid === currentUser.uid
      ) {
        const idToken = await currentUser.getIdToken()
        const boardId = this.props.router.query.boardId as string
        const board = await this.getBoard(idToken, boardId)

        const cardLists = await this.getCardLists(
          board.data.card_lists,
          idToken
        )

        const allCards = []
        for (let i = 0; i < cardLists?.data.length; i++) {
          if (cardLists.data[i].cards.length) {
            const cards = await this.getCards(cardLists.data[i].cards, idToken)
            allCards.push(cards.data)
          }
        }

        this.setState({
          user: {
            uid: currentUser.uid,
            idToken,
            pk: authenticated.data.pk,
            boards: authenticated.data.boards,
          },
          showSpinner: false,
          board: board.data,
          cardLists: cardLists?.data || [],
          cards: allCards,
        })
      }
    }
  }

  async getBoard(
    idToken: string,
    boardId: string
  ): Promise<AxiosResponse<Board>> {
    const resp: AxiosResponse<Board> = await this.client.get(
      `/board/${boardId}`,
      {
        headers: this.client.setAuthHeader(idToken),
      }
    )

    return resp
  }

  async getCardLists(
    cardListIds: number[],
    idToken: string
  ): Promise<AxiosResponse<CardList[]>> {
    const lists = cardListIds.join(',')
    const resp: AxiosResponse<CardList[]> = await this.client.get(
      `/card-lists/?pks=${lists}`,
      {
        headers: this.client.setAuthHeader(idToken),
      }
    )

    return resp
  }

  async getCardList(cardListId: number): Promise<AxiosResponse<CardList>> {
    const resp: AxiosResponse<CardList> = await this.client.get(
      `/card-list/${cardListId}/`,
      { headers: this.client.setAuthHeader(this.state.user.idToken) }
    )

    return resp
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

  async setCardListsState() {
    const board = await this.getBoard(
      this.state.user.idToken,
      this.state.board.pk.toString()
    )
    const cardLists = await this.getCardLists(
      board.data.card_lists,
      this.state.user.idToken
    )

    this.setState({
      board: {
        ...this.state.board,
        card_lists: cardLists.data.map((cardList) => cardList.pk),
      },
      cardLists: cardLists.data || [],
    })
  }

  async setCardListState(cardListId: number) {
    const cardList = await this.getCardList(cardListId)
    const listCards = await this.getCards(
      cardList.data.cards,
      this.state.user.idToken
    )

    const allCardsCopy = [...this.state.cards]
    const allCardsIndex = allCardsCopy.findIndex(
      (card) => listCards.data[0].card_list === card[0].card_list
    )

    allCardsCopy.splice(allCardsIndex, 1)
    allCardsCopy.splice(allCardsIndex, 0, listCards.data)

    const allCardListsCopy = [...this.state.cardLists]
    const allCardListsIndex = allCardListsCopy.findIndex(
      (allCardList) => allCardList.pk === cardList.data.pk
    )

    allCardListsCopy.splice(allCardListsIndex, 1)
    allCardListsCopy.splice(allCardListsIndex, 0, cardList.data)

    this.setState({
      cards: allCardsCopy,
      cardLists: allCardListsCopy,
    })
  }

  async onDragEnd(results) {
    console.log(results)
  }

  private setRequestErrorState() {
    this.setState({
      errors: {
        requestError: {
          ...this.state.errors.requestError,
          status: true,
        },
      },
    })
  }

  private filterCards(cardListId: number): Card[] {
    const cards = (this.state.cards.filter((card: Card[]) => {
      return card[0].card_list === cardListId
    }) as unknown) as Card[][]
    if (!cards.length) {
      return []
    }

    return this.sortCardsByPosition(cards[0])
  }

  private sortCardsByPosition(cards: Card[]) {
    return cards.sort((a, b) => a.position - b.position)
  }

  render() {
    return (
      <Box id="container">
        <Flex
          justifyContent="center"
          mt="2"
          display={this.state.errors.requestError.status ? 'flex' : 'none'}
          position="absolute"
          width="100%"
          flexWrap="wrap"
        >
          <Alert status="error" maxWidth="500px">
            <AlertIcon />
            <AlertDescription>
              {this.state.errors.requestError.message}
            </AlertDescription>
          </Alert>
        </Flex>
        <Box position="relative" left="50%" top="calc(50vh - 60px)">
          <Spinner display={this.state.showSpinner ? 'flex' : 'none'} />
        </Box>

        <Flex
          flexDirection="column"
          width="100%"
          display={!this.state.showSpinner ? 'flex' : 'none'}
        >
          <Heading
            as="h1"
            fontSize="lg"
            mt="8"
            ml="4"
            mb="4"
            pb="4"
            maxWidth="50%"
            wordBreak="break-word"
            borderBottom="1px solid #c5c1c1c9"
          >
            {this.state.board.title}
          </Heading>

          <Box overflowX="auto">
            <Flex
              justifyContent="flex-start"
              alignItems="flex-start"
              flexDirection="row"
              minWidth="100%"
              minHeight="100vh"
              float="left"
            >
              {this.state.cardLists.map((cardList) => (
                <CardListPanel
                  cardList={cardList}
                  cards={this.filterCards(cardList.pk)}
                  idToken={this.state.user.idToken}
                  setCardListState={this.setCardListState.bind(this)}
                  onDragEnd={this.onDragEnd.bind(this)}
                  key={cardList.pk}
                />
              ))}
              <AddCardList
                boardId={this.state.board.pk}
                idToken={this.state.user.idToken}
                setCardListsState={this.setCardListsState.bind(this)}
              />
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  }
}

export default withRouter(BoardComponent)
