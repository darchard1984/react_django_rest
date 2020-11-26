import { User } from '../Home/types'

export type BoardTitleFormState = {
  boardTitle: string
}

export type BoardTitleFormProps = {
  user: User
  setBoardsState: () => Promise<void>
}
