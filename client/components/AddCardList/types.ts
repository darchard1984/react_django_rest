export type AddListProps = {
  boardId: number
  idToken: string
  setCardListState: () => Promise<void>
}

export type AddListState = {
  showForm: boolean
}

export type CardList = {
  board: number
  cards: number[]
  created_at: string
  updated_at: string
  title: string
  pk: number
}
