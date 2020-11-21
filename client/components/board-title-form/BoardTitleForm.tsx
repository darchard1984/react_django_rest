import React from 'react'
import { Formik, Field, Form, FormikProps } from 'formik'

import {
  Flex,
  Input,
  FormControl,
  FormLabel,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react'

import { BoardTitleFormProps } from './types'
import BoardTitleFormSchema from './BoardTitleFormSchema'
import ApiClient from '../../services/api'

const client = new ApiClient()

const BoardTitleForm: React.FC<BoardTitleFormProps> = (props) => {
  const _handleSumbit = async (values: { boardTitle: string }) => {
    const { boardTitle } = BoardTitleFormSchema.cast(values)
    props.setState({ boardTitle })

    const resp = await client.post(
      '/board/',
      {
        data: { title: boardTitle, user: props.currentUser.pk },
      },
      { headers: client.setAuthHeader(props.currentUser.idToken) }
    )
  }
  return (
    <Formik
      initialValues={{ boardTitle: props.boardTitle }}
      onSubmit={_handleSumbit}
      validationSchema={BoardTitleFormSchema}
    >
      {(props) => (
        <Form>
          <Field name="boardTitle">
            {({ field, form }) => (
              <FormControl
                width={['80%', '400px']}
                isInvalid={form.errors.boardTitle && form.touched.boardTitle}
              >
                <FormLabel mb="12" fontSize="lg" htmlFor="board-title">
                  Let's start by giving your board a title.
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
                    Done
                  </Button>
                </Flex>
                <FormErrorMessage>{form.errors.boardTitle}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </Form>
      )}
    </Formik>
  )
}

export default BoardTitleForm
