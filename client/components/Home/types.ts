export type User = {
  uid: string
  idToken: string
  pk: number | null
  boards: number[]
}

export type UserBoard = {
  created_at: string
  updated_at: string
  pk: number
  title: string
  user: number
  card_lists: number[]
}

export type HomeState = {
  user: User
  userBoards: UserBoard[]
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
