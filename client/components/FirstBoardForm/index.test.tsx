import FirstBoardForm, { createBoard } from '.'
import { FirstBoardFormProps, FirstBoardFormState } from './types'
import { act, fireEvent, render } from '@testing-library/react'

import { FormikHelpers } from 'formik'
import React from 'react'
import { User } from '../Home/types'
import axios from 'axios'

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

  it('createBoard should complete successfully', async () => {
    const mockAxios = axios as jest.Mocked<typeof axios>
    mockAxios.create.mockImplementationOnce(
      jest.fn().mockReturnValue({
        request: jest.fn().mockResolvedValue({ status: 201 }),
      })
    )
    const props = ({
      user: {
        uid: 'Foo',
        idToken: 'Fake',
        pk: 1,
        boards: [],
      },
      setBoardsState: jest.fn(),
    } as unknown) as FirstBoardFormProps
    const formValues = {
      boardTitle: 'Foo',
    } as FirstBoardFormState
    const formikHelpers = ({
      setSubmitting: jest.fn(),
      setErrors: jest.fn(),
      resetForm: jest.fn(),
    } as unknown) as FormikHelpers<FirstBoardFormState>

    await createBoard(props, formValues, formikHelpers)

    expect(props.setBoardsState).toHaveBeenCalled()
    expect(formikHelpers.resetForm).toHaveBeenCalled()
    expect(formikHelpers.setSubmitting).toHaveBeenCalledTimes(2)
  })

  it('createBoard should call setErrors if request fails and error message shown', async () => {
    const mockAxios = axios as jest.Mocked<typeof axios>
    mockAxios.create.mockImplementationOnce(
      jest.fn().mockReturnValue({
        request: jest.fn().mockImplementationOnce(() => {
          throw new Error()
        }),
      })
    )
    const props = ({
      user: {
        uid: 'Foo',
        idToken: 'Fake',
        pk: 1,
        boards: [],
      },
      setBoardsState: jest.fn(),
    } as unknown) as FirstBoardFormProps
    const formValues = {
      boardTitle: 'Foo',
    } as FirstBoardFormState
    const formikHelpers = ({
      setSubmitting: jest.fn(),
      setErrors: jest.fn(),
      resetForm: jest.fn(),
    } as unknown) as FormikHelpers<FirstBoardFormState>

    await createBoard(props, formValues, formikHelpers)

    expect(props.setBoardsState).toHaveBeenCalledTimes(0)
    expect(formikHelpers.resetForm).toHaveBeenCalledTimes(0)
    expect(formikHelpers.setSubmitting).toHaveBeenCalledTimes(1)
    expect(formikHelpers.setErrors).toHaveBeenCalled()
  })
})
