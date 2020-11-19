import Head from 'next/head'
import React from 'react'
import BoardTitleForm from '../components/board-title-form/BoardTitleForm'

import { Flex, Box } from '@chakra-ui/react'
import firebase from 'firebase/app'
import 'firebase/auth'
import ApiClient from '../services/api'
import { HomeState } from './types'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  })
}

const client = new ApiClient()

export default class Home extends React.Component<any, HomeState> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentUserUid: '',
      boardTitle: '',
      persist: false,
    }
  }

  async componentDidMount() {
    let currentUser = firebase.auth().currentUser
    if (!currentUser) {
      await this.signIn()
      currentUser = firebase.auth().currentUser
    }

    const idToken = await currentUser?.getIdToken()
    const authenticate = await client.get('/authenticate/', {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })

    if (
      authenticate.status === 200 &&
      authenticate.data.firebase_uid === currentUser.uid
    ) {
      this.setState({ persist: true, currentUserUid: currentUser.uid })
    }
  }

  async signIn(): Promise<firebase.auth.UserCredential | undefined> {
    try {
      const r = await firebase.auth().signInAnonymously()
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
          ></BoardTitleForm>
        </Flex>
      </div>
    )
  }
}
