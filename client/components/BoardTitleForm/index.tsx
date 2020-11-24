import React from 'react'
import { Formik, Field, Form } from 'formik'

import {
  Flex,
  Input,
  FormControl,
  FormLabel,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react'

import { BoardTitleFormProps } from './types'
import BoardTitleFormSchema from './schema'
import ApiClient from '../../services/api'

const BoardTitleForm: React.FC<BoardTitleFormProps> = (props) => {
  const client = new ApiClient()

  const _handleSumbit = async (
    values: { boardTitle: string },
    { setErrors, resetForm }
  ) => {
    const { boardTitle } = BoardTitleFormSchema.cast(values)

    try {
      await client.post(
        '/board/',
        {
          data: { title: boardTitle, user: props.user.pk },
        },
        { headers: client.setAuthHeader(props.user.idToken) }
      )
      props.setBoardsState()
      resetForm()
    } catch (e) {
      setErrors({
        boardTitle:
          'Something went wrong, we could not save your board at this time.',
      })
    }
  }

  return (
    <Formik
      initialValues={{ boardTitle: '' }}
      onSubmit={_handleSumbit}
      validationSchema={BoardTitleFormSchema}
    >
      {(props) => (
        <Flex width={['80%', '500px']}>
          <Form>
            <Field name="boardTitle">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.boardTitle && form.touched.boardTitle}
                >
                  <FormLabel mb="12" fontSize="lg" htmlFor="board-title">
                    Let's start by adding a new board.
                  </FormLabel>
                  <Flex>
                    <Input
                      {...field}
                      id="board-title"
                      isRequired={true}
                      fontSize="md"
                      type="text"
                      variant="flushed"
                    ></Input>

                    <Button
                      type="submit"
                      variant="outline"
                      ml={['4', '8']}
                      size="sm"
                      alignSelf="flex-end"
                      colorScheme="blue"
                    >
                      Add
                    </Button>
                  </Flex>
                  <FormErrorMessage>{form.errors.boardTitle}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Form>
        </Flex>
      )}
    </Formik>
  )
}

export default BoardTitleForm
