import ApiClient from '../ApiClient'
import { AxiosResponse } from 'axios'
import { UserResponse } from '../../components/Home/types'
import auth from '../../lib/firebase'
import firebase from 'firebase/app'

export default async function authenticate(
  currentUser: firebase.User,
  onError?: () => void
) {
  const client = new ApiClient()
  const idToken = await currentUser.getIdToken()

  const resp: AxiosResponse<UserResponse> = await client.request(
    'GET',
    '/authenticate/',
    {
      headers: client.setAuthHeader(idToken),
    },
    onError
  )
  return resp
}

export async function signIn(onError?: () => void): Promise<firebase.User> {
  try {
    await auth.signInAnonymously()
    return auth.currentUser
  } catch (e) {
    if (onError) onError()
  }
}
