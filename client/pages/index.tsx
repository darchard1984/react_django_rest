import Head from 'next/head'
import React from 'react'
import BoardTitleForm from '../components/BoardTitleForm'
import firebase from 'firebase/app'
import { Flex, Box, Text } from '@chakra-ui/react'
import auth from '../lib/firebase'
import ApiClient from '../services/api'
import { HomeState } from './types'

const client = new ApiClient()

class Home extends React.Component<any, HomeState> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentUser: {
        idToken: '',
        uid: '',
        pk: null,
      },
      boardTitle: '',
      errors: {
        serverError: {
          status: false,
          message: 'It looks like something went wrong, please try again later',
        },
      },
    }
  }

  async componentDidMount() {
    let currentUser = await auth.currentUser
    if (!currentUser) {
      await this.signIn()
      currentUser = await auth.currentUser
    }

    await this.authenticate(currentUser)
  }

  async authenticate(currentUser: firebase.User) {
    const idToken = await currentUser.getIdToken()

    try {
      const authenticate = await client.get('/authenticate/', {
        headers: client.setAuthHeader(idToken),
      })

      if (
        authenticate.status === 200 &&
        authenticate.data.firebase_uid === currentUser.uid
      ) {
        this.setState({
          currentUser: {
            uid: currentUser.uid,
            idToken,
            pk: authenticate.data.pk,
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
          ></BoardTitleForm>
        </Flex>
      </Box>
    )
  }
}

export default Home
