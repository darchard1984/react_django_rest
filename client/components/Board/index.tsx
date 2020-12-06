import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react'
import authenticate, { signIn } from '../../lib/authenticate'

import { AddCard } from '../AddCard'
import AddCardList from '../AddCardList'
import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import { BoardProps } from './types'
import { CardList } from '../AddCardList/types'
import CardListTitle from '../CardListTitle'
import Cards from '../Cards'
import React from 'react'
import { UserBoard } from '../Home/types'
import { withRouter } from 'next/router'

class Board extends React.Component<BoardProps, any> {
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
      boardId: null,
      board: {},
      cardLists: [],
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
        authenticated?.status === 200 &&
        authenticated?.data.firebase_uid === currentUser.uid
      ) {
        const idToken = await currentUser.getIdToken()
        const boardId = this.props.router.query.boardId as string
        const board = await this.getBoard(idToken, boardId)

        const cardLists = await this.getCardLists(
          board.data.card_lists,
          idToken
        )

        this.setState({
          user: {
            uid: currentUser.uid,
            idToken,
            pk: authenticated.data.pk,
            boards: authenticated.data.boards,
          },
          boardId: this.props.router.query.boardId,
          board: board?.data || {},
          cardLists: cardLists?.data || [],
        })
      }
    }
  }

  async getBoard(
    idToken: string,
    boardId: string
  ): Promise<AxiosResponse<UserBoard> | undefined> {
    const resp: AxiosResponse<UserBoard> | undefined = await this.client.get(
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
  ): Promise<AxiosResponse<CardList[]> | undefined> {
    const lists = cardListIds.join(',')
    const resp: AxiosResponse<CardList[]> | undefined = await this.client.get(
      `/card-lists/?pks=${lists}`,
      {
        headers: this.client.setAuthHeader(idToken),
      }
    )

    return resp
  }

  async setCardListState() {
    const board = await this.getBoard(
      this.state.user.idToken,
      this.state.boardId
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
      cardLists: cardLists?.data || [],
    })
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

  getBoardIdFromPath() {
    return this.props.router.query.boardId
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
          <Spinner display={!this.state.user.pk ? 'flex' : 'none'} />
        </Box>

        <Flex
          flexDirection="column"
          width="100%"
          display={this.state.boardId ? 'flex' : 'none'}
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
                <Flex
                  width="225px"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="flex-start"
                  background="lightGrey"
                  margin="2"
                  borderRadius=".3rem"
                  padding="2"
                  key={cardList.pk}
                >
                  <CardListTitle cardListTitle={cardList.title} />
                  {cardList.cards.length ? (
                    <Cards
                      cardIds={cardList.cards}
                      idToken={this.state.user.idToken}
                    />
                  ) : (
                    []
                  )}
                  <AddCard
                    cardListId={cardList.pk}
                    idToken={this.state.user.idToken}
                  />
                </Flex>
              ))}
              <AddCardList
                boardId={this.state.boardId}
                idToken={this.state.user.idToken}
                setCardListState={this.setCardListState.bind(this)}
              />
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  }
}

export default withRouter(Board)
