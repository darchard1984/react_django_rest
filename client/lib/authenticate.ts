import ApiClient from '../services/api'
import { AxiosResponse } from 'axios'
import { UserResponse } from '../components/Home/types'
import auth from './firebase'
import firebase from 'firebase/app'

const client = new ApiClient()

export default async function authenticate(
  currentUser: firebase.User,
  callback: () => void
) {
  const idToken = await currentUser.getIdToken()

  const resp: AxiosResponse<UserResponse> = await client.get(
    '/authenticate/',
    {
      headers: client.setAuthHeader(idToken),
    },
    callback
  )
  return resp
}

export async function signIn(
  callback?: () => void
): Promise<firebase.User | undefined> {
  try {
    await auth.signInAnonymously()
    return auth.currentUser
  } catch (e) {
    if (callback) callback()
  }
}
