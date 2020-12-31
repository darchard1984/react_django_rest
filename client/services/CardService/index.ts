import { Card } from '../../components/AddCard/types'
import { CardList } from '../../components/AddCardList/types'
import { DraggableLocation } from 'react-beautiful-dnd'

export default class CardService {
  filterCardsByCardListId(cardListId: number, cards: Card[][]): Card[] | [] {
    const allCards = (cards.filter((cards: Card[]) => {
      if (cards.length) return cards[0].card_list === cardListId
    }) as unknown) as Card[][]
    if (!allCards.length) {
      return []
    }

    return allCards[0].sort((a, b) => a.position - b.position)
  }

  getCardsByDraggableLocationId(
    locationId: string,
    cards: Card[][]
  ): Card[] | [] {
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

    const cardsFromSourceList = this.getCardsByDraggableLocationId(
      source.droppableId,
      allCardsCopy
    )

    const sourceCard = cardsFromSourceList.splice(source.index, 1)
    let cardsFromDestList: Card[] = []

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
      cardsFromDestList = this.getCardsByDraggableLocationId(
        destination.droppableId,
        allCardsCopy
      )

      const destListHadNoCards = cardsFromDestList.length ? false : true

      cardsFromDestList.splice(destination.index, 0, sourceCard[0])
      cardsFromDestList.forEach((card, index) => (card.position = index))
      cardsFromSourceList.forEach((card, index) => (card.position = index))

      if (destListHadNoCards) allCardsCopy.push(cardsFromDestList)
    } else {
      cardsFromSourceList.splice(destination.index, 0, sourceCard[0])
      cardsFromSourceList.forEach((card, index) => (card.position = index))
    }

    return [
      allCardsCopy,
      allCardListsCopy,
      cardsFromSourceList,
      cardsFromDestList,
    ]
  }
}
