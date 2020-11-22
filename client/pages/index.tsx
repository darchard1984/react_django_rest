import React from 'react'
import BoardTitleForm from '../components/BoardTitleForm'
import firebase from 'firebase/app'
import { Flex, Box, Text, Spinner } from '@chakra-ui/react'
import auth from '../lib/firebase'
import ApiClient from '../services/api'

type CurrentUser = {
  uid: string
  idToken: string
  pk: number | null
  boards: number[] | []
}

type HomeState = {
  currentUser: CurrentUser
  errors: {
    serverError: {
      status: boolean
      message: string
    }
  }
}

type HomeProps = {
  currentUser: CurrentUser
  errors: {
    serverError: {
      status: boolean
      message: string
    }
  }
}

class Home extends React.Component<HomeProps, HomeState> {
  client = new ApiClient()
  constructor(props: any) {
    super(props)
    this.state = {
      currentUser: {
        idToken: '',
        uid: '',
        pk: null,
        boards: [],
      },
      errors: {
        serverError: {
          status: false,
          message: '',
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
    // If the user has boards get all the boards for the user
    // and populate the full board objects
  }

  async authenticate(currentUser: firebase.User) {
    const idToken = await currentUser.getIdToken()

    try {
      const resp = await this.client.get('/authenticate/', {
        headers: this.client.setAuthHeader(idToken),
      })

      if (resp.status === 200 && resp.data.firebase_uid === currentUser.uid) {
        this.setState({
          currentUser: {
            uid: currentUser.uid,
            idToken,
            pk: resp.data.pk,
            boards: resp.data.boards,
          },
        })
      }
    } catch (e) {
      this.setState({
        errors: {
          serverError: {
            ...this.state.errors.serverError,
            status: true,
          },
        },
      })
    }
  }

  async signIn(): Promise<firebase.auth.UserCredential | undefined> {
    try {
      const r = await auth.signInAnonymously()
      return r
    } catch (e) {
      // TODO: Send to Sentry
      this.setState({
        errors: {
          serverError: {
            ...this.state.errors.serverError,
            status: true,
          },
        },
      })
    }
  }

  setBoardsState = async () => {
    const resp = await this.client.get(`/user/${this.state.currentUser.pk}`, {
      headers: this.client.setAuthHeader(this.state.currentUser.idToken),
    })

    // make API call here to get user and set full boards state

    if (resp.status === 200) {
      const boards = resp.data.boards
      this.setState((prev) => {
        return {
          ...prev,
          currentUser: {
            ...prev.currentUser,
            boards,
          },
        }
      })
    }
  }

  render() {
    return (
      <Box>
        <Flex
          justifyContent="center"
          mt="8"
          display={this.state.errors.serverError.status ? 'flex' : 'none'}
          position="absolute"
          width="100%"
        >
          <Flex
            backgroundColor="errorRed"
            border="1px solid red"
            padding="2"
            width="400px"
            justifyContent="center"
            borderRadius="0.375rem"
          >
            <Text>{this.state.errors.serverError.message}</Text>
          </Flex>
        </Flex>
        <Flex display={this.state.currentUser.boards.length ? 'flex' : 'none'}>
          <Text as="h1">Your boards</Text>
          <Text>A board</Text>
        </Flex>

        <Flex
          justifyContent="center"
          height={[
            'calc(100vh - 120px)',
            'calc(100vh - 120px)',
            'calc(100vh - 240px)',
          ]}
          alignItems="center"
          display={!this.state.currentUser.boards.length ? 'flex' : 'none'}
        >
          <Spinner display={!this.state.currentUser.pk ? 'block' : 'none'} />
          <Box display={this.state.currentUser.pk ? 'block' : 'none'}>
            <BoardTitleForm
              setState={this.setBoardsState}
              currentUser={this.state.currentUser}
            />
          </Box>
        </Flex>
      </Box>
    )
  }
}

export default Home
