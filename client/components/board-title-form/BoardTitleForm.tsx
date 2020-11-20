import React from 'react'
import { Formik, Field, FormikProps, Form } from 'formik'

import {
  Flex,
  Input,
  FormControl,
  FormLabel,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react'

import { BoardTitleFormProps } from './types'

const BoardTitleForm: React.FC<BoardTitleFormProps> = (props) => {
  return (
    <Formik
      initialValues={{ boardTitle: props.boardTitle }}
      onSubmit={(values: { boardTitle: string }) => {
        props.setState({ ...values })
      }}
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
                  <FormErrorMessage>{form.errors.boardTitle}</FormErrorMessage>
                </Flex>
              </FormControl>
            )}
          </Field>
        </Form>
      )}
    </Formik>
  )
}

export default BoardTitleForm
