import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { FirstBoardFormProps, FirstBoardFormState } from './types'

import ApiClient from '../../services/ApiClient'
import FirstBoardFormSchema from './schema'
import React from 'react'

const FirstBoardForm: React.FC<FirstBoardFormProps> = (props) => {
  return (
    <Formik
      initialValues={{ boardTitle: '' }}
      onSubmit={(values, formikHelpers) =>
        createBoard(props, values, formikHelpers)
      }
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
                    />
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

export const createBoard = async (
  props: FirstBoardFormProps,
  values: FirstBoardFormState,
  formikHelpers: FormikHelpers<FirstBoardFormState>
) => {
  const { setSubmitting, setErrors, resetForm } = formikHelpers
  const client = new ApiClient()
  setSubmitting(true)
  const { boardTitle } = FirstBoardFormSchema.cast({ ...values })

  const resp = await client.request(
    'POST',
    '/board/',
    {
      data: { title: boardTitle, user: props.user.pk },
      headers: client.setAuthHeader(props.user.idToken),
    },
    () => {
      setErrors({
        boardTitle:
          'Something went wrong, we could not save your board at this time.',
      })
    }
  )

  if (resp?.status === 201) {
    await props.setBoardsState()
    resetForm()
    setSubmitting(false)
  }
}

export default FirstBoardForm
