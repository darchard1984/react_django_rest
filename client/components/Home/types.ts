import { Board } from '../AddBoard/types'

export type User = {
  uid: string
  idToken: string
  pk: number | null
  boards: number[]
}

export type HomeState = {
  user: User
  boards: Board[]
  errors: {
    requestError: {
      status: boolean
      message: string
    }
  }
}

export type UserResponse = {
  boards: number[]
  created_at: string
  updated_at: string
  pk: number
  firebase_uid: string
}
