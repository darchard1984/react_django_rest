import { User } from '../Home/types'

export type BoardFormState = {
  boardTitle: string
}

export type FirstBoardFormProps = {
  user: User
  setBoardsState: () => Promise<void>
}
