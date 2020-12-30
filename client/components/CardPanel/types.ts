import { Card } from '../AddCard/types'

export type CardComponentProps = {
  card: Card
  index: number
  idToken: string
  setErrorState: () => void
  setBoardState: (idToken: string) => void
}
