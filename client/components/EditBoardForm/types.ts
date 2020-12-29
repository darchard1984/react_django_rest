import { Board } from '../AddBoard/types'
import { User } from '../Home/types'

export type EditBoardFormProps = {
  display: boolean
  board: Board
  user: User
  setShowEditFormState: (state: boolean) => void
  setBoardsState: () => void
  setErrorState: () => void
}
