export type AddCardListProps = {
  boardId: number
  idToken: string
  setBoardState: (idToken: string) => Promise<void>
}

export type AddCardListState = {
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
