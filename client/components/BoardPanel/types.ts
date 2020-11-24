import { UserBoard, User } from '../Home/types'

export type BoardPanelProps = {
  board: UserBoard
  user: User
  setBoardsState: () => void
  setErrorState: () => void
}

export type BoardIconProps = {
  boardId: number
  icon: any
  ariaLabel: string
  onIconClick: (boardId: number) => void
}
