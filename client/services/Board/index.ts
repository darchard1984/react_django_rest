import ApiClient from '../../services/ApiClient'
import { AxiosResponse } from 'axios'
import { User } from '../../components/Home/types'

const createBoard = async (
  boardTitle: string,
  user: User,
  onError: () => void
): Promise<AxiosResponse> => {
  const client = new ApiClient()

  const resp = await client.request(
    'POST',
    '/board/',
    {
      data: { title: boardTitle, user: user.pk },
      headers: client.setAuthHeader(user.idToken),
    },
    onError
  )

  return resp
}

export default createBoard
