import { User, UserBoard } from '../Home/types'

export type BoardPanelProps = {
  board: UserBoard
  user: User
  setBoardsState: () => void
  setErrorState: () => void
}
