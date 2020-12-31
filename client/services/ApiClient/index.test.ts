import ApiClient from '.'

jest.mock('axios', () => {
  return {
    create: jest.fn().mockReturnValue({
      request: jest.fn(),
    }),
  }
})

describe('ApiClient', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('ApiClient.request calls axios.request', async () => {
    const client = new ApiClient()

    await client.request('GET', '/api/', {})

    expect(client.api.request).toHaveBeenCalled()
  })

  it('ApiClient.request calls onError callback on error', async () => {
    const client = new ApiClient()
    client.api.request = async () => {
      throw Error('Bad things happened')
    }
    const onError = jest.fn()

    await client.request('GET', '/api/', {}, onError)

    expect(onError).toHaveBeenCalled()
  })
  it('ApiClient.setAuthHeader returns Authorization header', () => {
    const header = new ApiClient().setAuthHeader('foo')

    expect(header).toEqual({ Authorization: 'Bearer foo' })
  })
})
