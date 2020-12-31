import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Heading,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import { BoardProps, BoardState } from './types'
import authenticate, { signIn } from '../../services/Authenticate'

import AddCardList from '../AddCardList'
import ApiClient from '../../services/ApiClient'
import { AxiosResponse } from 'axios'
import { Board } from '../AddBoard/types'
import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'
import CardListPanel from '../CardListPanel'
import CardService from '../../services/CardService'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { DragDropContext } from 'react-beautiful-dnd'
import { DropResult } from 'react-beautiful-dnd'
import React from 'react'
import { withRouter } from 'next/router'

class BoardComponent extends React.Component<BoardProps, BoardState> {
  client: ApiClient
  cardService: CardService
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
    this.client = new ApiClient()
    this.cardService = new CardService()
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
      cardLists: cardLists?.sort((a, b) => a.pk - b.pk) || [],
      cards: allCards,
    })
  }

  async getBoard(
    idToken: string,
    boardId: string
  ): Promise<AxiosResponse<Board>> {
    const resp: AxiosResponse<Board> = await this.client.request(
      'GET',
      `/board/${boardId}/`,
      {
        headers: this.client.setAuthHeader(idToken),
      },
      this.setRequestErrorState.bind(this)
    )

    return resp
  }

  async getCardLists(
    cardListIds: number[],
    idToken: string
  ): Promise<AxiosResponse<CardList[]>> {
    const lists = cardListIds.join(',')
    const resp: AxiosResponse<CardList[]> = await this.client.request(
      'GET',
      `/card-lists/?pks=${lists}`,
      {
        headers: this.client.setAuthHeader(idToken),
      },
      this.setRequestErrorState.bind(this)
    )

    return resp
  }

  async getCards(
    cardIds: number[],
    idToken: string
  ): Promise<AxiosResponse<Card[]>> {
    const ids = cardIds.join(',')
    const resp: AxiosResponse<Card[]> = await this.client.request(
      'GET',
      `/cards/?pks=${ids}`,
      {
        headers: this.client.setAuthHeader(idToken),
      },
      this.setRequestErrorState.bind(this)
    )

    return resp
  }

  updateCardPosition = async (result: DropResult) => {
    const { destination, source } = result
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const [
      allUpdatedCards,
      allUpdatedCardLists,
      updatedSourceCards,
      updatedDestCards,
    ] = this.cardService.updateCardAndListPositions(
      this.state.cards,
      this.state.cardLists,
      source,
      destination
    )

    this.setState({
      cardLists: allUpdatedCardLists,
      cards: allUpdatedCards,
    })
    await this.updateCards(updatedSourceCards)
    if (updatedDestCards.length) await this.updateCards(updatedDestCards)
  }

  async updateCards(cards: Card[]) {
    await this.client.request(
      'PUT',
      '/cards/update/',
      {
        headers: this.client.setAuthHeader(this.state.user.idToken),
        data: { cards },
      },

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
            m="4"
            pb="4"
            wordBreak="break-word"
            borderBottom="1px solid #c5c1c1c9"
          >
            {this.state.board.title}
          </Heading>

          <Box overflowX="auto">
            <DragDropContext onDragEnd={this.updateCardPosition}>
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
                    cards={this.cardService.filterCardsByCardListId(
                      cardList.pk,
                      this.state.cards
                    )}
                    user={this.state.user}
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
