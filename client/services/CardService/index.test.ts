import { Card } from '../../components/AddCard/types'
import { CardList } from '../../components/AddCardList/types'
import CardService from '.'

describe('CardService', () => {
  it('filterCardsByCardListId should return array of cards from array of card arrays', () => {
    const cardOne = { card_list: 1 } as Card
    const cardTwo = { card_list: 2 } as Card

    const cardsForCardList = new CardService().filterCardsByCardListId(1, [
      [cardOne],
      [cardTwo],
    ])

    expect(cardsForCardList.length).toEqual(1)
    expect(cardsForCardList[0].card_list).toEqual(1)
  })

  it('filterCardsByCardListId should return empty array if no match', () => {
    const cardOne = { card_list: 1 } as Card
    const cardTwo = { card_list: 2 } as Card

    const cardsForCardList = new CardService().filterCardsByCardListId(3, [
      [cardOne],
      [cardTwo],
    ])

    expect(cardsForCardList.length).toEqual(0)
  })

  it('filterCardsByCardListId should sort cards by position, lowest first', () => {
    const cardOne = { card_list: 1, position: 1 } as Card
    const cardTwo = { card_list: 1, position: 2 } as Card

    const cardsForCardList = new CardService().filterCardsByCardListId(1, [
      [cardOne, cardTwo],
    ])

    expect(cardsForCardList.length).toEqual(2)
    expect(cardsForCardList[0].position < cardsForCardList[1].position).toEqual(
      true
    )
  })

  it('getCardsByDraggableLocationId should return array of cards where card_list matches draggable location', () => {
    const cardOne = { card_list: 1, position: 1 } as Card
    const cardTwo = { card_list: 2, position: 1 } as Card

    const cardsForCardList = new CardService().getCardsByDraggableLocationId(
      '1',
      [[cardOne], [cardTwo]]
    )

    expect(cardsForCardList.length).toEqual(1)
    expect(cardsForCardList[0].card_list.toString()).toEqual('1')
  })

  it('getCardsByDraggableLocationId should return empty array when no match is found', () => {
    const cardOne = { card_list: 1, position: 1 } as Card
    const cardTwo = { card_list: 2, position: 1 } as Card

    const cardsForCardList = new CardService().getCardsByDraggableLocationId(
      '3',
      [[cardOne], [cardTwo]]
    )

    expect(cardsForCardList.length).toEqual(0)
  })

  it('updateCardAndListPositions should update when moving cards between lists', () => {
    const cardOne = { card_list: 1, position: 0, pk: 1 } as Card
    const cardTwo = { card_list: 2, position: 0, pk: 2 } as Card
    const cardThree = { card_list: 2, position: 1, pk: 3 } as Card
    const allCards = [[cardOne], [cardTwo, cardThree]]

    const listOne = { pk: 1, cards: [1] } as CardList
    const listTwo = { pk: 2, cards: [2, 3] } as CardList
    const allLists = [listOne, listTwo]

    // Take from card list 2, at position 0
    const source = {
      droppableId: '2',
      index: 0,
    }

    // Move to card list 1, at position 1
    const destination = {
      droppableId: '1',
      index: 1,
    }

    const [
      allUpdatedCards,
      allUpdatedLists,
      updatedSourceCards,
      updatedDestCards,
    ] = new CardService().updateCardAndListPositions(
      allCards,
      allLists,
      source,
      destination
    )

    // Card objects should have swapped card arrays
    expect(allUpdatedCards[0].length).toEqual(2)
    expect(allUpdatedCards[1].length).toEqual(1)
    expect(allUpdatedCards[0][0].pk).toEqual(1)
    expect(allUpdatedCards[0][0].position).toEqual(0)
    expect(allUpdatedCards[0][1].pk).toEqual(2)
    expect(allUpdatedCards[0][1].position).toEqual(1)
    expect(allUpdatedCards[1][0].pk).toEqual(3)
    expect(allUpdatedCards[1][0].position).toEqual(0)

    // Card List object cards array should have updated pks
    expect(allUpdatedLists[0].cards.length).toEqual(2)
    expect(allUpdatedLists[1].cards.length).toEqual(1)
    expect(allUpdatedLists[0].cards[0]).toEqual(1)
    expect(allUpdatedLists[0].cards[1]).toEqual(2)
    expect(allUpdatedLists[1].cards[0]).toEqual(3)

    expect(updatedSourceCards.length).toEqual(1)
    expect(updatedDestCards.length).toEqual(2)
  })

  it('updateCardAndListPositions should update when moving within the same list', () => {
    const cardOne = { card_list: 1, position: 0, pk: 1 } as Card
    const cardTwo = { card_list: 2, position: 0, pk: 2 } as Card
    const cardThree = { card_list: 2, position: 1, pk: 3 } as Card
    const allCards = [[cardOne], [cardTwo, cardThree]]

    const listOne = { pk: 1, cards: [1] } as CardList
    const listTwo = { pk: 2, cards: [2, 3] } as CardList
    const allLists = [listOne, listTwo]

    // Take from card list 2, at position 0
    const source = {
      droppableId: '2',
      index: 0,
    }

    // Move to card list 1, at position 1
    const destination = {
      droppableId: '2',
      index: 1,
    }

    const [
      allUpdatedCards,
      allUpdatedLists,
      updatedSourceCards,
      updatedDestCards,
    ] = new CardService().updateCardAndListPositions(
      allCards,
      allLists,
      source,
      destination
    )

    // Card objects should have new positions
    expect(allUpdatedCards[0].length).toEqual(1)
    expect(allUpdatedCards[1].length).toEqual(2)
    expect(allUpdatedCards[0][0].pk).toEqual(1)
    expect(allUpdatedCards[0][0].position).toEqual(0)
    expect(allUpdatedCards[1][0].pk).toEqual(3)
    expect(allUpdatedCards[1][0].position).toEqual(0)
    expect(allUpdatedCards[1][1].pk).toEqual(2)
    expect(allUpdatedCards[1][1].position).toEqual(1)

    // Card List cards array should have no change
    expect(allUpdatedLists[0].cards.length).toEqual(1)
    expect(allUpdatedLists[1].cards.length).toEqual(2)

    // Dest Cards is empty if moving cards within the source list
    expect(updatedSourceCards.length).toEqual(2)
    expect(updatedDestCards.length).toEqual(0)
  })
})
