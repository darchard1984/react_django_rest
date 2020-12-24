import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  Spinner,
} from '@chakra-ui/react'
import { BoardProps, BoardState } from './types'
import { DragDropContext, DraggableLocation } from 'react-beautiful-dnd'
import authenticate, { signIn } from '../../lib/authenticate'

import AddCardList from '../AddCardList'
import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import { Board } from '../AddBoard/types'
import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'
import CardListPanel from '../CardListPanel'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { DropResult } from 'react-beautiful-dnd'
import React from 'react'
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
        authenticated.status !== 200 &&
        authenticated.data.firebase_uid === currentUser.uid
      ) {
        this.props.router.push('/')
        return
      }

      if (!authenticated.data.boards.length) return this.props.router.push('/')

      const idToken = await currentUser.getIdToken()
      this.setState({
        user: {
          uid: currentUser.uid,
          idToken,
          pk: authenticated.data.pk,
          boards: authenticated.data.boards,
        },
      })
      await this.setBoardState(idToken)
      this.setState({ showSpinner: false })
    }
  }

  async setBoardState(idToken: string) {
    const boardId = this.props.router.query.boardId as string
    const board = await this.getBoard(this.state.user.idToken, boardId)

    let cardLists: CardList[]
    const allCards = []
    if (board?.data.card_lists.length) {
      const cardListsResp = await this.getCardLists(
        board.data.card_lists,
        this.state.user.idToken
      )

      cardLists = cardListsResp?.data

      for (let i = 0; i < cardLists.length; i++) {
        if (cardLists[i].cards.length) {
          const cards = await this.getCards(cardLists[i].cards, idToken)
          allCards.push(cards.data)
        }
      }
    }

    this.setState({
      board: board.data,
      cardLists: cardLists || [],
      cards: allCards,
    })
  }

  async getBoard(
    idToken: string,
    boardId: string
  ): Promise<AxiosResponse<Board>> {
    const resp: AxiosResponse<Board> = await this.client.get(
      `/board/${boardId}/`,
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

  onDragEnd = async (result: DropResult) => {
    const _getCardsForList = (
      allCards: Card[][],
      location: DraggableLocation
    ) => {
      return (
        allCards.filter((cards) => {
          if (cards.length) {
            const cardListId = location.droppableId

            return cards[0].card_list.toString() === cardListId
          }
        })[0] || []
      )
    }

    const { destination, source } = result
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const allCardsCopy = JSON.parse(JSON.stringify(this.state.cards))
    const allCardListsCopy = JSON.parse(JSON.stringify(this.state.cardLists))
    const sourceCards = _getCardsForList(allCardsCopy, source)
    const sourceCard = sourceCards.splice(source.index, 1)
    let destCards = []

    if (destination.droppableId !== source.droppableId) {
      const sourceCardList = allCardListsCopy.filter(
        (cardList) => cardList.pk.toString() === source.droppableId
      )[0]
      const destCardList = allCardListsCopy.filter(
        (cardList) => cardList.pk.toString() === destination.droppableId
      )[0]
      const sourceCardListCardIdIndex = sourceCardList.cards.findIndex(
        (cardId) => cardId === sourceCard[0].pk
      )

      // Update cardList.cards relationships
      sourceCardList.cards.splice(sourceCardListCardIdIndex, 1)
      destCardList.cards.push(sourceCard[0].pk)
      sourceCard[0].card_list = parseInt(destination.droppableId)

      // Update cards
      destCards = _getCardsForList(allCardsCopy, destination)
      const destCardsWasEmpty = destCards.length ? false : true

      destCards.splice(destination.index, 0, sourceCard[0])
      sourceCards.forEach((card, index) => (card.position = index))
      destCards.forEach((card, index) => (card.position = index))

      if (destCardsWasEmpty) allCardsCopy.push(destCards)
    } else {
      sourceCards.splice(destination.index, 0, sourceCard[0])
      sourceCards.forEach((card, index) => (card.position = index))
    }

    this.setState({
      cardLists: allCardListsCopy,
      cards: allCardsCopy,
    })
    await this.updateCards(sourceCards)
    if (destCards.length) await this.updateCards(destCards)
  }

  async updateCards(cards: Card[]) {
    await this.client.put(
      '/cards/update/',
      { data: cards },
      { headers: this.client.setAuthHeader(this.state.user.idToken) },
      this.setRequestErrorState.bind(this)
    )
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
    const allCards = (this.state.cards.filter((cards: Card[]) => {
      if (cards.length) return cards[0].card_list === cardListId
    }) as unknown) as Card[][]
    if (!allCards.length) {
      return []
    }

    return allCards[0].sort((a, b) => a.position - b.position)
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
          <Flex justifyContent="flex-start" alignItems="center" mt="8" ml="4">
            <IconButton
              mr="4"
              icon={<ChevronLeftIcon />}
              aria-label={'Back'}
              onClick={() => this.props.router.push('/')}
              background="lighterGrey"
              _hover={{ background: 'lightGrey' }}
            />
          </Flex>

          <Heading
            as="h1"
            fontSize="lg"
            mt="4"
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
            <DragDropContext onDragEnd={this.onDragEnd}>
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
                    setBoardState={this.setBoardState.bind(this)}
                    setErrorState={this.setRequestErrorState.bind(this)}
                    key={cardList.pk}
                  />
                ))}
                <AddCardList
                  boardId={this.state.board.pk}
                  idToken={this.state.user.idToken}
                  setBoardState={this.setBoardState.bind(this)}
                />
              </Flex>
            </DragDropContext>
          </Box>
        </Flex>
      </Box>
    )
  }
}

export default withRouter(BoardComponent)
