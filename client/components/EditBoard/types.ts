import { User } from '../Home/types'

export type EditBoardProps = {
  display: boolean
  title: string
  pk: number
  user: User
  setShowEditFormState: (state: boolean) => void
  setBoardsState: () => void
  setErrorState: () => void
}
