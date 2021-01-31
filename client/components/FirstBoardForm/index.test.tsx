import { act, fireEvent, render } from '@testing-library/react'

import FirstBoardForm from '.'
import React from 'react'
import { User } from '../Home/types'

jest.mock('axios')

describe('FirstBoardForm', () => {
  const setBoardState = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('Submit button should be disabled when no input value', () => {
    const user: User = {
      uid: 'Foo',
      idToken: 'Fake',
      pk: 1,
      boards: [],
    }
    const { getByText } = render(
      <FirstBoardForm user={user} setBoardsState={setBoardState} />
    )

    const buttonIsDisabled = getByText('Add').hasAttribute('disabled')

    expect(buttonIsDisabled).toEqual(true)
  })

  it('Submit button should be enabled when it has an input value', async () => {
    const user: User = {
      uid: 'Foo',
      idToken: 'Fake',
      pk: 1,
      boards: [],
    }
    const { container, getByText } = render(
      <FirstBoardForm user={user} setBoardsState={setBoardState} />
    )
    const input = container.querySelector(
      'input[name="boardTitle"]'
    ) as HTMLInputElement
    const button = getByText('Add')

    await act(async () => fireEvent.change(input, { target: { value: 'Foo' } }))

    expect(button.hasAttribute('disabled')).toEqual(false)
    expect(input.value).toEqual('Foo')
  })
})
