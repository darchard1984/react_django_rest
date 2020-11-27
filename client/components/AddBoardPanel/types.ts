import { User } from '../Home/types'

export type AddBoardPanelProps = {
  user: User
  setBoardsState: () => Promise<void>
}
