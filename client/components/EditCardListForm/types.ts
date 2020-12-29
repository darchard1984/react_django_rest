import { CardList } from '../AddCardList/types'

export type EditCardListFormProps = {
  display: boolean
  cardList: CardList
  idToken: string
  setShowEditFormState: (state: boolean) => void
  setBoardState: (idToken: string) => void
  setErrorState: () => void
}
