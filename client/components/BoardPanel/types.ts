import { Board } from '../AddBoard/types'
import { User } from '../Home/types'

export type BoardPanelProps = {
  board: Board
  user: User
  setBoardsState: () => void
  setErrorState: () => void
}
