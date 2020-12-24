import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'

export type CardListPanelProps = {
  cardList: CardList
  idToken: string
  cards: Card[] | []
  setBoardState: (idToken: string) => void
  setErrorState: () => void
}
