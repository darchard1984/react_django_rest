import { Card } from '../AddCard/types'

export type CardPanelProps = {
  card: Card
  index: number
  idToken: string
  setErrorState: () => void
  setBoardState: (idToken: string) => void
}
