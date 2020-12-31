import ApiClient from '../ApiClient'
import getUser from '.'
import { mocked } from 'ts-jest'

jest.mock('../ApiClient')

describe('getUser', () => {
  beforeEach(() => {
    mocked(ApiClient).mockClear()
  })

  afterEach(() => {
    mocked(ApiClient).mockRestore()
  })

  it('calls ApiClient with correct args', async () => {
    ApiClient.prototype.setAuthHeader = jest
      .fn()
      .mockReturnValue({ Authorization: 'Bearer foo' })
    const mockOnError = () => {}

    await getUser(1, 'mockToken', mockOnError)

    expect(ApiClient.prototype.request).toHaveBeenCalledWith(
      'GET',
      '/user/1/',
      {
        headers: { Authorization: 'Bearer foo' },
      },
      mockOnError
    )
  })
})
