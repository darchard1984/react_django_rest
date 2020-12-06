export type Card = {
  card_list: number
  title: string
  description: string
  position: number
  created_at: string
  updated_at: string
  pk: number
}

export type CardsState = {
  cards: Card[]
}

export type CardsProps = {
  idToken: string
  cardIds: number[]
}
