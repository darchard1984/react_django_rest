import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'

export type CardListPanelProps = {
  cardList: CardList
  idToken: string
  cards: Card[] | []
  onDragEnd: (results: any) => void
  setCardListState: (cardListId: number) => void
}

export type CardListPanelState = {
  cards: Card[]
}
