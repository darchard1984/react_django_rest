import React from 'react'
import BoardTitleForm from '../components/BoardTitleForm'
import firebase from 'firebase/app'
import {
  Flex,
  Box,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Heading,
} from '@chakra-ui/react'
import auth from '../lib/firebase'
import ApiClient from '../services/api'
import { AxiosResponse } from 'axios'

export type User = {
  uid: string
  idToken: string
  pk: number | null
  boards: number[]
}

type UserBoard = {
  created_at: string
  updated_at: string
  pk: number
  title: string
  user: number
  card_lists: number[]
}

type HomeState = {
  user: User
  userBoards: UserBoard[]
  errors: {
    requestError: {
      status: boolean
      message: string
    }
  }
}

type UserResponse = {
  boards: number[]
  created_at: string
  updated_at: string
  pk: number
  firebase_uid: string
}

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
        `/user/${this.state.user.pk}`,
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

  setBoardsState = async () => {
    const user = await this.getUser()
    const boardstring = user.boards.join(',')

    if (!boardstring) return

    let userBoards: UserBoard[]
    try {
      const resp = await this.client.get(`/boards/?pks=${boardstring}`, {
        headers: this.client.setAuthHeader(this.state.user.idToken),
      })
      userBoards = resp.data
    } catch (e) {
      this.setRequestErrorState()
    }

    if (!userBoards) return

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
          mt="8"
          display={this.state.errors.requestError.status ? 'flex' : 'none'}
          position="relative"
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
              <Flex
                backgroundColor="#fff"
                mt="8"
                ml="4"
                mr="4"
                mb="4"
                width="200px"
                minHeight="200px"
                justifyContent="center"
                alignItems="center"
                boxShadow="-1px 5px 61px 5px #00000021"
                borderRadius=".3rem"
              >
                {board.title}
              </Flex>
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
              setState={this.setBoardsState}
              user={this.state.user}
            />
          </Box>
        </Flex>
      </Box>
    )
  }
}

export default Home
