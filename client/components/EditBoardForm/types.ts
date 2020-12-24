import { User } from '../Home/types'

export type EditBoardFormProps = {
  display: boolean
  title: string
  pk: number
  user: User
  setShowEditFormState: (state: boolean) => void
  setBoardsState: () => void
  setErrorState: () => void
}
