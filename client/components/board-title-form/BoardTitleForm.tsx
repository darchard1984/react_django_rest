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

export default class BoardTitleForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      boardTitle: props.boardTitle,
    }
  }

  render() {
    return (
      <Formik
        initialValues={{ boardTitle: this.state.boardTitle }}
        onSubmit={(values) => {
          this.props.setState({ ...values })
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
                    <FormErrorMessage>
                      {form.errors.boardTitle}
                    </FormErrorMessage>
                  </Flex>
                </FormControl>
              )}
            </Field>
          </Form>
        )}
      </Formik>
    )
  }
}
