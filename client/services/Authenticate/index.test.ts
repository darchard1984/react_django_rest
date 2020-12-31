import authenticate, { signIn } from '.'

import ApiClient from '../ApiClient'
import firebase from 'firebase/app'

jest.mock('../ApiClient')
jest.mock('firebase/app')

describe('Authenticate.authenticate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls ApiClient with correct args', async () => {
    ApiClient.prototype.setAuthHeader = jest
      .fn()
      .mockReturnValue({ Authorization: 'Bearer foo' })

    const mockCurrentUser = {
      getIdToken: () => {},
    } as firebase.User
    const mockOnError = () => {}

    await authenticate(mockCurrentUser, mockOnError)

    expect(ApiClient.prototype.request).toHaveBeenCalledWith(
      'GET',
      '/authenticate/',
      {
        headers: { Authorization: 'Bearer foo' },
      },
      mockOnError
    )
  })
})
