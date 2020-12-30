import ApiClient, { IApiClient } from '../ApiClient'

import getUser from '.'

jest.mock('../ApiClient')

describe('getUser', () => {
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
