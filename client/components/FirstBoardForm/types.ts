import { User } from '../Home/types'

export type FirstBoardFormState = {
  boardTitle: string
}

export type FirstBoardFormProps = {
  user: User
  setBoardsState: () => Promise<void>
}
