import React from 'react'
import BoardTitleForm from '../components/BoardTitleForm'
import firebase from 'firebase/app'
import { Flex, Box, Text } from '@chakra-ui/react'
import auth from '../lib/firebase'
import ApiClient from '../services/api'
import { AxiosResponse } from 'axios'

type CurrentUser = {
  uid: string
  idToken: string
  pk: number | null
  boards: number[] | []
}

type HomeState = {
  currentUser: CurrentUser
  boardTitle: string
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

type AuthenticatedUserResponse = {
  pk: number
  firebase_uid: string
  boards: number[]
  created_at: string
  updated_at: string
  idToken: string
}
const client = new ApiClient()

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentUser: {
        idToken: '',
        uid: '',
        pk: null,
        boards: [],
      },
      boardTitle: '',
      errors: {
        serverError: {
          status: false,
          message: '',
        },
      },
    }
  }

  componentDidMount() {
    this.setState((prev, props) => {
      return {
        ...prev,
        ...props,
      }
    })
  }

  setBoardTitleState = (values: { boardTitle: string }) => {
    this.setState({ ...values })
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
        <Flex
          justifyContent="center"
          height={[
            'calc(100vh - 120px)',
            'calc(100vh - 120px)',
            'calc(100vh - 240px)',
          ]}
          alignItems="center"
        >
          <BoardTitleForm
            setState={this.setBoardTitleState}
            boardTitle={this.state.boardTitle}
            currentUser={this.state.currentUser}
          />
        </Flex>
      </Box>
    )
  }
}

export default Home

export async function getServerSideProps() {
  const currentUser = await getCurrentUser()
  const idToken = await currentUser.getIdToken()

  let resp: AxiosResponse
  let callDidError = false
  try {
    resp = await client.get('/authenticate/', {
      headers: client.setAuthHeader(idToken),
    })
  } catch (e) {
    // TODO: Send to Sentry
    callDidError = true
  }

  if (callDidError)
    return {
      props: {
        errors: {
          serverError: {
            status: true,
            message:
              'It looks like something went wrong, please try again later',
          },
        },
      },
    }

  if (resp.data.boards.length) {
    return {
      redirect: {
        destination: '/board',
        permanent: false,
      },
    }
  }

  return {
    props: {
      currentUser: {
        uid: resp.data.firebase_uid,
        pk: resp.data.pk,
        boards: resp.data.boards,
        idToken,
      },
    },
  }
}

async function getCurrentUser(): Promise<firebase.User> {
  let currentUser = auth.currentUser
  if (!currentUser) {
    await this.signIn()
    currentUser = auth.currentUser
  }
  return currentUser
}

async function signIn(): Promise<firebase.auth.UserCredential | undefined> {
  try {
    const r = await auth.signInAnonymously()
    return r
  } catch (e) {
    // TODO: Send to Sentry
  }
}
