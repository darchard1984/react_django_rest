import { User } from '../Home/types'

export type AddBoardPanelProps = {
  user: User
  setBoardsState: () => Promise<void>
}

export type AddBoardState = {
  showForm: boolean
}

export type Board = {
  card_lists: number[]
  created_at: string
  updated_at: string
  title: string
  pk: number
  user: number
}
