import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react'
import { HomeState, UserBoard, UserResponse } from './types'
import authenticate, { signIn } from '../../lib/authenticate'

import AddBoardPanel from '../AddBoardPanel'
import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import BoardPanel from '../BoardPanel'
import BoardTitleForm from '../BoardTitleForm'
import React from 'react'
import auth from '../../lib/firebase'
import firebase from 'firebase/app'

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
      userBoards: [],
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
        authenticated?.status === 200 &&
        authenticated?.data.firebase_uid === currentUser.uid
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

  async getUser(): Promise<UserResponse | undefined> {
    const resp: AxiosResponse<UserResponse> = await this.client.get(
      `/user/${this.state.user.pk}/`,
      {
        headers: this.client.setAuthHeader(this.state.user.idToken),
      },
      this.setRequestErrorState.bind(this)
    )

    const user = resp?.data
    return user
  }

  async setBoardsState() {
    const user = await this.getUser()

    if (!user?.boards.length) {
      this.setState((prev) => {
        return {
          ...prev,
          user: {
            ...prev.user,
            boards: [],
          },
          userBoards: [],
        }
      })
      return
    }

    const boardstring = user.boards.join(',')
    let userBoards: UserBoard[]

    const resp = await this.client.get(
      `/boards/?pks=${boardstring}`,
      {
        headers: this.client.setAuthHeader(this.state.user.idToken),
      },
      this.setRequestErrorState.bind(this)
    )

    if (!resp) return

    userBoards = resp.data

    this.setState((prev) => {
      return {
        ...prev,
        user: {
          ...prev.user,
          boards: userBoards.map((board) => board.pk),
        },
        userBoards,
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
          flexDirection="column"
          width={{ base: '100%', xl: '1440px' }}
          margin="0 auto"
          display={this.state.userBoards.length ? 'flex' : 'none'}
        >
          <Flex borderBottom="1px solid #c5c1c1c9">
            <Heading as="h1" fontSize="lg" mt="8" ml="4" mb="4">
              Your boards
            </Heading>
          </Flex>
          <Flex
            justifyContent="flex-start"
            alignItems="flex-start"
            flexDirection="row"
            width="100%"
            flexWrap="wrap"
          >
            {this.state.userBoards.map((board) => (
              <BoardPanel
                key={board.pk}
                board={board}
                user={this.state.user}
                setBoardsState={this.setBoardsState.bind(this)}
                setErrorState={this.setRequestErrorState.bind(this)}
              />
            ))}
            <AddBoardPanel
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
