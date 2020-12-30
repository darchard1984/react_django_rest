import axios, { AxiosInstance, AxiosResponse, Method } from 'axios'

export class ApiClientError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'ApiClientError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export interface IApiClient {
  api: AxiosInstance
  request: (
    method: string,
    url: string,
    config: { headers?: any; data?: any }
  ) => Promise<AxiosResponse>
  setAuthHeader: (idToken: string) => void
}

class ApiClient implements IApiClient {
  api: AxiosInstance
  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 5000,
    })
  }

  async request(
    method: Method,
    url: string,
    config: {
      headers?: any
      data?: any
    },
    onError?: () => void
  ): Promise<AxiosResponse> {
    try {
      if (!['GET', 'DELETE', 'PUT', 'POST'].includes(method)) {
        throw Error('Method not supported')
      }

      const resp = await this.api.request({
        method,
        url,
        headers: config.headers || {},
        data: config.data || {},
      })

      return resp
    } catch (error) {
      const e = new ApiClientError(`${error.message}`)
      this.handleError(e)
      if (onError) onError()
    }
  }

  private handleError(error: any): void {
    if (process.env.NEXT_PUBLIC_APP_STAGE === 'prod') {
      // TODO: Send to Sentry
    } else {
      console.log(error)
    }
  }

  setAuthHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    }
  }
}

export default ApiClient
