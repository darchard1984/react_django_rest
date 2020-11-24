import React from 'react'
import BoardTitleForm from '../BoardTitleForm'
import firebase from 'firebase/app'
import {
  Flex,
  Box,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Heading,
  IconButton,
  Divider,
} from '@chakra-ui/react'
import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import auth from '../../lib/firebase'
import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import { HomeState, UserBoard, UserResponse } from './types'
import { BoardPanel } from '../BoardPanel'

class Home extends React.Component<any, HomeState> {
  client = new ApiClient()
  constructor(props: any) {
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
    let currentUser = auth.currentUser
    if (!currentUser) {
      await this.signIn()
      currentUser = auth.currentUser
    }

    await this.authenticate(currentUser)
    await this.setBoardsState()
  }

  async authenticate(currentUser: firebase.User) {
    const idToken = await currentUser.getIdToken()

    try {
      const resp: AxiosResponse<UserResponse> = await this.client.get(
        '/authenticate/',
        {
          headers: this.client.setAuthHeader(idToken),
        }
      )

      if (resp.status === 200 && resp.data.firebase_uid === currentUser.uid) {
        this.setState({
          user: {
            uid: currentUser.uid,
            idToken,
            pk: resp.data.pk,
            boards: resp.data.boards,
          },
        })
      }
    } catch (e) {
      this.setRequestErrorState()
    }
  }

  async signIn(): Promise<firebase.auth.UserCredential | undefined> {
    try {
      const r = await auth.signInAnonymously()

      return r
    } catch (e) {
      this.setRequestErrorState()
    }
  }

  async getUser(): Promise<UserResponse | undefined> {
    try {
      const resp: AxiosResponse<UserResponse> = await this.client.get(
        `/user/${this.state.user.pk}/`,
        {
          headers: this.client.setAuthHeader(this.state.user.idToken),
        }
      )

      const user = resp.data
      return user
    } catch (e) {
      this.setRequestErrorState()
    }
  }

  async setBoardsState() {
    const user = await this.getUser()

    if (!user.boards.length) {
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
    try {
      const resp = await this.client.get(`/boards/?pks=${boardstring}`, {
        headers: this.client.setAuthHeader(this.state.user.idToken),
      })
      userBoards = resp.data
    } catch (e) {
      this.setRequestErrorState()
    }

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
            justifyContent={{ base: 'center', xl: 'flex-start' }}
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
          </Flex>
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
          <Spinner display={!this.state.user.pk ? 'block' : 'none'} />
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
