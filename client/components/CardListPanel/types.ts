import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'

export type CardListPanelProps = {
  cardList: CardList
  idToken: string
  cards: Card[] | []
  onDragEnd: (results: any) => void
  setBoardState: (idToken: string) => void
}

export type CardListPanelState = {
  cards: Card[]
}
