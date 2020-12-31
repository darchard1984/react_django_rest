import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import ApiClient from '../../services/ApiClient'
import { FirstBoardFormProps } from './types'
import FirstBoardFormSchema from './schema'
import React from 'react'

const FirstBoardForm: React.FC<FirstBoardFormProps> = (props) => {
  const client = new ApiClient()

  const _createBoard = async (
    values: { boardTitle: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    setSubmitting(true)
    const { boardTitle } = FirstBoardFormSchema.cast({ ...values })

    const resp = await client.request(
      'POST',
      '/board/',
      {
        data: { title: boardTitle, user: props.user.pk },
        headers: client.setAuthHeader(props.user.idToken),
      },
      () =>
        setErrors({
          boardTitle:
            'Something went wrong, we could not save your board at this time.',
        })
    )

    if (resp.status == 201) {
      await props.setBoardsState()
      resetForm()
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={{ boardTitle: '' }}
      onSubmit={_createBoard}
      validationSchema={FirstBoardFormSchema}
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
                      isLoading={form.isSubmitting}
                      isDisabled={!form.values.boardTitle}
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

export default FirstBoardForm
