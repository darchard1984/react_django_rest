import { Board } from '../AddBoard/types'
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
  errors: {
    requestError: {
      status: boolean
      message: string
    }
  }
}
