import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'

export type CardsState = {
  cards: Card[]
}

export type CardsProps = {
  idToken: string
  cardList: CardList
  cards: Card[] | []
}
