export type AddCardProps = {
  cardListId: number
  idToken: string
  nextPosition: number
  setBoardState: (idToken: string) => void
}

export type AddCardState = {
  showForm: boolean
}

export type Card = {
  card_list: number
  title: string
  description: string
  position: number
  created_at: string
  updated_at: string
  pk: number
}
