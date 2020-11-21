import Head from 'next/head'
import React from 'react'
import BoardTitleForm from '../components/board-title-form/BoardTitleForm'
import firebase from 'firebase/app'
import { Flex, Box } from '@chakra-ui/react'
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
  }

  async signIn(): Promise<firebase.auth.UserCredential | undefined> {
    try {
      const r = await auth.signInAnonymously()
      return r
    } catch (e) {
      // TODO: Handle error, send to Sentry
    }
  }

  setBoardTitleState = (values: { boardTitle: string }) => {
    this.setState({ ...values })
  }

  render() {
    return (
      <div>
        <Head>
          <title>Lystly</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Flex
          as="nav"
          fontFamily="system"
          fontWeight="bold"
          fontSize="md"
          width="100%"
          height="60px"
          justifyContent="flex-start"
          alignItems="center"
          boxShadow="5px -8px 15px 5px rgba(0,0,0,0.22)"
        >
          <Box ml="8">Lystly</Box>
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
      </div>
    )
  }
}

export default Home
