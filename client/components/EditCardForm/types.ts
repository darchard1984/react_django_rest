import { Card } from '../AddCard/types'

export type EditCardFormProps = {
  display: boolean
  card: Card
  idToken: string
  setShowEditFormState: (state: boolean) => void
  setBoardState: (idToken: string) => void
  setErrorState: () => void
}
