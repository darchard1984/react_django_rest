import ApiClient from '../../services/ApiClient'
import { AxiosResponse } from 'axios'
import { UserResponse } from '../../components/Home/types'

export default async function getUser(
  userId: number,
  idToken: string,
  onError: () => void
): Promise<UserResponse | undefined> {
  const client = new ApiClient()

  const resp: AxiosResponse<UserResponse> = await client.request(
    'GET',
    `/user/${userId}/`,
    {
      headers: client.setAuthHeader(idToken),
    },
    onError
  )

  return resp?.data
}
