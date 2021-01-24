import { act, fireEvent, render } from '@testing-library/react'

import AddBoard from '../../components/AddBoard'
import React from 'react'
import { User } from '../Home/types'

jest.mock('axios')

describe('AddBoard', () => {
  const setBoardState = jest.fn()
  const user: User = {
    uid: 'Foo',
    idToken: 'Fake',
    pk: 1,
    boards: [],
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('It should mount without the add board form in the DOM', () => {
    const { getByTestId } = render(
      <AddBoard user={user} setBoardsState={setBoardState} />
    )

    const addBoardForm = getByTestId('add-board-form')
    const style = window.getComputedStyle(addBoardForm)

    expect(style.display).toBe('none')
  })

  it('It should mount with the show add board form button in the DOM', () => {
    const { getByTestId } = render(
      <AddBoard user={user} setBoardsState={setBoardState} />
    )

    const showAddBoardFormButton = getByTestId('show-add-board-form')
    const style = window.getComputedStyle(showAddBoardFormButton)

    expect(style.display).toBe('block')
  })

  it('Add board form IS in the DOM if show form button is clicked', () => {
    const { getByTestId } = render(
      <AddBoard user={user} setBoardsState={setBoardState} />
    )

    const showAddBoardFormButton = getByTestId('show-add-board-form')
    showAddBoardFormButton.click()

    const addBoardForm = getByTestId('add-board-form')
    const style = window.getComputedStyle(addBoardForm)

    expect(style.display).toBe('block')
  })

  it('It should NOT have the add board form in the DOM if close form button is clicked', () => {
    const { getByTestId } = render(
      <AddBoard user={user} setBoardsState={setBoardState} />
    )

    const showAddBoardFormButton = getByTestId('show-add-board-form')
    const closeFormButton = getByTestId('close-form')

    showAddBoardFormButton.click()

    let addBoardForm = getByTestId('add-board-form')
    let addBoardFormstyle = window.getComputedStyle(addBoardForm)

    expect(addBoardFormstyle.display).toBe('block')

    closeFormButton.click()

    addBoardForm = getByTestId('add-board-form')
    addBoardFormstyle = window.getComputedStyle(addBoardForm)

    expect(addBoardFormstyle.display).toBe('none')
  })

  it('Submit button should be disabled when no input entered', () => {
    const { getByTestId, debug } = render(
      <AddBoard user={user} setBoardsState={setBoardState} />
    )

    const showAddBoardFormButton = getByTestId('show-add-board-form')
    const submit = getByTestId('add-board-form-submit')

    showAddBoardFormButton.click()

    expect(submit.hasAttribute('disabled'))
  })

  it('Submit button should be enabled when it has an input value', async () => {
    const { getByTestId, debug } = render(
      <AddBoard user={user} setBoardsState={setBoardState} />
    )

    const showAddBoardFormButton = getByTestId('show-add-board-form')
    const submit = getByTestId('add-board-form-submit')
    const input = getByTestId('add-board-form-input') as HTMLInputElement

    showAddBoardFormButton.click()

    expect(submit.hasAttribute('disabled'))

    await act(async () => fireEvent.change(input, { target: { value: 'Foo' } }))

    expect(input.value).toEqual('Foo')
    expect(submit.hasAttribute('disabled')).toEqual(false)
  })
})
