import ApiClient from '../ApiClient'
import { Card } from '../../components/AddCard/types'
import { CardList } from '../../components/AddCardList/types'
import { DraggableLocation } from 'react-beautiful-dnd'

export default class CardService {
  client: ApiClient
  constructor() {
    this.client = new ApiClient()
  }

  filterCardsByCardListId(cardListId: number, cards: Card[][]): Card[] {
    const allCards = (cards.filter((cards: Card[]) => {
      if (cards.length) return cards[0].card_list === cardListId
    }) as unknown) as Card[][]
    if (!allCards.length) {
      return []
    }

    return allCards[0].sort((a, b) => a.position - b.position)
  }

  getCardsByDraggableLocationId(cards: Card[][], locationId: string) {
    return (
      cards.filter((cards) => {
        if (cards.length) {
          const cardListId = locationId

          return cards[0].card_list.toString() === cardListId
        }
      })[0] || []
    )
  }

  updateCardAndListPositions(
    cards: Card[][],
    cardLists: CardList[],
    source: DraggableLocation,
    destination: DraggableLocation
  ) {
    const allCardsCopy = JSON.parse(JSON.stringify(cards))
    const allCardListsCopy = JSON.parse(JSON.stringify(cardLists))

    const sourceCards = this.getCardsByDraggableLocationId(
      allCardsCopy,
      source.droppableId
    )
    const sourceCard = sourceCards.splice(source.index, 1)
    let destCards: Card[] = []

    if (destination.droppableId !== source.droppableId) {
      const sourceCardList = allCardListsCopy.filter(
        (cardList) => cardList.pk.toString() === source.droppableId
      )[0]
      const destCardList = allCardListsCopy.filter(
        (cardList) => cardList.pk.toString() === destination.droppableId
      )[0]
      const cardIndexOfSourceCardListCards = sourceCardList.cards.findIndex(
        (cardId) => cardId === sourceCard[0].pk
      )

      // Update cardList.cards relationships
      sourceCardList.cards.splice(cardIndexOfSourceCardListCards, 1)
      destCardList.cards.push(sourceCard[0].pk)
      sourceCard[0].card_list = parseInt(destination.droppableId)

      // Update cards
      destCards = this.getCardsByDraggableLocationId(
        allCardsCopy,
        destination.droppableId
      )

      const destListHadNoCards = destCards.length ? false : true

      destCards.splice(destination.index, 0, sourceCard[0])
      destCards.forEach((card, index) => (card.position = index))
      sourceCards.forEach((card, index) => (card.position = index))

      if (destListHadNoCards) allCardsCopy.push(destCards)
    } else {
      sourceCards.splice(destination.index, 0, sourceCard[0])
      sourceCards.forEach((card, index) => (card.position = index))
    }

    return [allCardsCopy, allCardListsCopy, sourceCards, destCards]
  }
}
