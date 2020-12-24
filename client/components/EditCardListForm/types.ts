import { User } from '../Home/types'

export type EditCardListFormProps = {
  display: boolean
  title: string
  pk: number
  idToken: string
  boardId: number
  setShowEditFormState: (state: boolean) => void
  setBoardState: (idToken: string) => void
  setErrorState: () => void
}
