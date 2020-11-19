import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class ApiClient {
  api: AxiosInstance
  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 1000,
    })
  }

  _handleError(error: any): void {
    // TODO Handle error, push to Sentry
    console.log(error)
  }

  async get(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse | undefined> {
    try {
      const resp = await this.api.get(path, config)
      return resp
    } catch (error) {
      this._handleError(error)
    }
  }

  async post(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse | undefined> {
    try {
      const resp = await this.api.post(path, config || {})
      return resp
    } catch (error) {
      this._handleError(error)
    }
  }
}

export default ApiClient
