import ApiClient from '../services/ApiClient'
import { AxiosResponse } from 'axios'
import { UserResponse } from '../components/Home/types'
import auth from './firebase'
import firebase from 'firebase/app'

const client = new ApiClient()

export default async function authenticate(
  currentUser: firebase.User,
  onError?: () => void
) {
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

export async function getUser(
  userId: number,
  idToken: string,
  onError: () => void
): Promise<UserResponse> {
  const resp: AxiosResponse<UserResponse> = await client.request(
    'GET',
    `/user/${userId}/`,
    {
      headers: client.setAuthHeader(idToken),
    },
    onError
  )

  return resp.data
}
