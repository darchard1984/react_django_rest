import { User } from '../Home/types'

export type AddBoardPanelFormProps = {
  user: User
  setBoardsState: () => Promise<void>
}
