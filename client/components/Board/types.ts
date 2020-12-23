import { Board } from '../AddBoard/types'
import { Card } from '../AddCard/types'
import { CardList } from '../AddCardList/types'
import { NextRouter } from 'next/router'
import { User } from '../Home/types'

export type BoardProps = {
  router: NextRouter
}

export type BoardState = {
  cardLists: CardList[]
  board: Board
  user: User
  showSpinner: boolean
  cards: Card[][]
  errors: {
    requestError: {
      status: boolean
      message: string
    }
  }
}
