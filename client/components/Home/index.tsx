import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react'
import authenticate, { getUser, signIn } from '../../lib/authenticate'

import AddBoard from '../AddBoard'
import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import { Board } from '../AddBoard/types'
import BoardPanel from '../BoardPanel'
import BoardTitleForm from '../BoardTitleForm'
import { HomeState } from './types'
import React from 'react'

class Home extends React.Component<any, HomeState> {
  client = new ApiClient()
  constructor(props) {
    super(props)
    this.state = {
      user: {
        idToken: '',
        uid: '',
        pk: null,
        boards: [],
      },
      boards: [],
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
      let currentUser = await signIn(this.setRequestErrorState.bind(this))

      if (!currentUser) return

      const authenticated = await authenticate(
        currentUser,
        this.setRequestErrorState.bind(this)
      )
      if (
        authenticated.status === 200 &&
        authenticated.data.firebase_uid === currentUser.uid
      ) {
        const idToken = await currentUser.getIdToken()
        this.setState({
          user: {
            uid: currentUser.uid,
            idToken,
            pk: authenticated.data.pk,
            boards: authenticated.data.boards,
          },
        })
        await this.setBoardsState()
      }
    }
  }

  async setBoardsState() {
    const userResp = await getUser(
      this.state.user.pk,
      this.state.user.idToken,
      this.setRequestErrorState.bind(this)
    )

    if (!userResp.boards.length) {
      this.setState((prev) => {
        return {
          user: {
            ...prev.user,
            boards: [],
          },
          boards: [],
        }
      })
      return
    }

    const resp: AxiosResponse<Board[]> = await this.client.get(
      `/boards/?pks=${userResp.boards.join(',')}`,
      {
        headers: this.client.setAuthHeader(this.state.user.idToken),
      },
      this.setRequestErrorState.bind(this)
    )

    this.setState((prev) => {
      return {
        user: {
          ...prev.user,
          boards: userResp.boards,
        },
        boards: resp.data.sort((a, b) => a.pk - b.pk),
      }
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
        >
          <Alert status="error" maxWidth="500px">
            <AlertIcon />
            <AlertDescription>
              {this.state.errors.requestError.message}
            </AlertDescription>
          </Alert>
        </Flex>

        <Flex
          flexDirection="column"
          display={this.state.boards.length ? 'flex' : 'none'}
        >
          <Heading
            as="h1"
            fontSize="lg"
            mt="8"
            ml="4"
            mb="4"
            borderBottom="1px solid lightGrey"
          >
            Your boards
          </Heading>

          <Flex
            justifyContent="flex-start"
            alignItems="flex-start"
            flexDirection="row"
            width="100%"
            flexWrap="wrap"
          >
            {this.state.boards.map((board) => (
              <BoardPanel
                key={board.pk}
                board={board}
                user={this.state.user}
                setBoardsState={this.setBoardsState.bind(this)}
                setErrorState={this.setRequestErrorState.bind(this)}
              />
            ))}
            <AddBoard
              user={this.state.user}
              setBoardsState={this.setBoardsState.bind(this)}
            />
          </Flex>
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
          justifyContent="center"
          height={{
            base: 'calc(100vh - 120px)',
            xl: 'calc(100vh - 240px)',
          }}
          alignItems="center"
          display={!this.state.user.boards.length ? 'flex' : 'none'}
        >
          <Box display={this.state.user.pk ? 'block' : 'none'}>
            <BoardTitleForm
              setBoardsState={this.setBoardsState.bind(this)}
              user={this.state.user}
            />
          </Box>
        </Flex>
      </Box>
    )
  }
}

export default Home
