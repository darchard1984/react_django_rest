import { AddBoardPanelProps, AddBoardState, Board } from './types'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Textarea,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import AddBoardPanelSchema from './schema'
import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import React from 'react'

export class AddBoard extends React.Component<
  AddBoardPanelProps,
  AddBoardState
> {
  client = new ApiClient()
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
    }
  }

  toggleForm = () => {
    this.setState({ showForm: true })
  }

  handlePanelInputClose = () => {
    this.setState({
      showForm: false,
    })
  }

  handleSumbit = async (
    values: { boardTitle: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    setSubmitting(true)
    const { boardTitle } = AddBoardPanelSchema.cast({ ...values })

    const resp: AxiosResponse<Board> = await this.client.post(
      '/board/',
      {
        data: { title: boardTitle, user: this.props.user.pk },
      },
      { headers: this.client.setAuthHeader(this.props.user.idToken) },
      () =>
        setErrors({
          boardTitle: 'Something went wrong, could not save your board.',
        })
    )

    if (resp?.status == 201) {
      await this.props.setBoardsState()
      resetForm()
      setSubmitting(false)
      this.setState({
        showForm: false,
      })
    }
  }

  render() {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt="8"
        ml="4"
        mr="4"
        mb="4"
        width="200px"
        minHeight="150px"
      >
        <IconButton
          display={this.state.showForm ? 'none' : 'block'}
          aria-label="add a new board"
          icon={<AddIcon />}
          onClick={this.toggleForm}
        />
        <Flex display={this.state.showForm ? 'block' : 'none'}>
          <Formik
            initialValues={{ boardTitle: '' }}
            onSubmit={this.handleSumbit}
            validationSchema={AddBoardPanelSchema}
          >
            {(props) => (
              <Form>
                <Field name="boardTitle">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.boardTitle && form.touched.boardTitle
                      }
                    >
                      <Flex
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        flexDirection="column"
                        backgroundColor="#fff"
                        width="200px"
                        boxShadow="-1px 5px 61px 5px #00000021"
                        borderRadius=".3rem"
                        padding="4"
                      >
                        <Flex justifyContent="flex-end" width="100%">
                          <IconButton
                            icon={<CloseIcon />}
                            aria-label="Close add board input"
                            size="xs"
                            onClick={this.handlePanelInputClose}
                          />
                        </Flex>
                        <Divider mt="2" mb="2" />
                        <Textarea
                          {...field}
                          id="board-title"
                          isRequired={true}
                          fontSize="sm"
                          resize="none"
                          variant=""
                          padding="0"
                          maxLength="50"
                        />

                        <FormErrorMessage fontSize="xs" mb="4">
                          {form.errors.boardTitle}
                        </FormErrorMessage>
                        <Button
                          type="submit"
                          variant="outline"
                          ml={['4', '8']}
                          size="xs"
                          alignSelf="flex-end"
                          colorScheme="blue"
                          isLoading={form.isSubmitting}
                          isDisabled={!form.values.boardTitle}
                        >
                          Add
                        </Button>
                      </Flex>
                    </FormControl>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </Flex>
      </Flex>
    )
  }
}

export default AddBoard
