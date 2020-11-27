import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react'
import { NextRouter, withRouter } from 'next/router'
import authenticate, { signIn } from '../../lib/authenticate'

import ApiClient from '../../services/api'
import React from 'react'

type BoardProps = {
  router: NextRouter
}

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
        this.setState({
          user: {
            uid: currentUser.uid,
            idToken,
            pk: authenticated.data.pk,
            boards: authenticated.data.boards,
          },
          boardId: this.props.router.query.boardId,
          board: board?.data || {},
        })
      }
    }
  }

  async getBoard(idToken: string, boardId: string) {
    const resp = await this.client.get(`/board/${boardId}`, {
      headers: this.client.setAuthHeader(idToken),
    })

    return resp
  }

  // async getCardLists(boardId: string, idToken: string) {
  //   const resp = await this.client.get(`/card-lists/${boardId}`, {
  //     headers: this.client.setAuthHeader(idToken),
  //   })

  //   return resp
  // }

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
      <Box>
        <Flex
          justifyContent="center"
          mt="2"
          display={this.state.errors.requestError.status ? 'flex' : 'none'}
          position="absolute"
          width="100%"
          flexWrap="wrap"
          id="outer"
        >
          <Alert status="error" maxWidth="500px">
            <AlertIcon />
            <AlertDescription>
              {this.state.errors.requestError.message}
            </AlertDescription>
          </Alert>
        </Flex>
        <Flex
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100vh"
          display={!this.state.user.pk ? 'flex' : 'none'}
        >
          <Spinner />
        </Flex>

        <Flex
          flexDirection="column"
          width={{ base: '100%', xl: '1440px' }}
          margin="0 auto"
          display={this.state.boardId ? 'flex' : 'none'}
        >
          <Flex borderBottom="1px solid #c5c1c1c9">
            <Heading as="h1" fontSize="lg" mt="8" ml="4" mb="4">
              {this.state.board.title}
            </Heading>
          </Flex>
          <Flex
            justifyContent="flex-start"
            alignItems="flex-start"
            flexDirection="row"
            width="100%"
            flexWrap="wrap"
          ></Flex>
        </Flex>
      </Box>
    )
  }
}

export default withRouter(Board)
