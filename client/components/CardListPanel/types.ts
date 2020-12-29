import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'
import { User } from '../Home/types'

export type CardListPanelProps = {
  cardList: CardList
  user: User
  cards: Card[] | []
  setBoardState: (idToken: string) => void
  setErrorState: () => void
}
