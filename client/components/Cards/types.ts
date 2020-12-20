import { Card } from '../AddCard/types'

export type CardsState = {
  cards: Card[]
}

export type CardsProps = {
  idToken: string
  cardIds: number[]
}
