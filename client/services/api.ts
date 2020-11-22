import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { string } from 'yup'

class ApiClientError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'ApiClientError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

class ApiClient {
  api: AxiosInstance
  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 1000,
    })
  }

  private _handleError(error: any): void {
    if (process.env.NEXT_PUBLIC_APP_STAGE === 'prod') {
      // TODO Handle error, push to Sentry
    } else {
      console.log(error)
    }
  }

  setAuthHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  async get(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse | undefined> {
    try {
      const resp = await this.api.get(path, config || {})

      return resp
    } catch (error) {
      const e = new ApiClientError(`${error.message}`)
      this._handleError(e)
      throw e
    }
  }

  async post(
    path: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse | undefined> {
    try {
      const resp = await this.api.post(path, data, config || {})
      return resp
    } catch (error) {
      const e = new ApiClientError(`${error.message}`)
      this._handleError(e)
      throw e
    }
  }
}

export default ApiClient
