import { AddBoardPanelProps, AddBoardState, Board } from './types'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import AddBoardPanelSchema from './schema'
import ApiClient from '../../services/ApiClient'
import { AxiosResponse } from 'axios'
import React from 'react'

export class AddBoard extends React.Component<
  AddBoardPanelProps,
  AddBoardState
> {
  client: ApiClient
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
    }
    this.client = new ApiClient()
  }

  toggleForm = () => {
    this.setState({ showForm: true })
  }

  handlePanelInputClose = () => {
    this.setState({
      showForm: false,
    })
  }

  createBoard = async (
    values: { boardTitle: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    setSubmitting(true)
    const { boardTitle } = AddBoardPanelSchema.cast({ ...values })

    const resp: AxiosResponse<Board> = await this.client.request(
      'POST',
      '/board/',
      {
        data: { title: boardTitle, user: this.props.user.pk },
        headers: this.client.setAuthHeader(this.props.user.idToken),
      },
      () =>
        setErrors({
          boardTitle: 'Something went wrong, could not save your board.',
        })
    )

    if (resp.status == 201) {
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
        mt="2"
        mx="4"
        mb="4"
        width="200px"
        minHeight={this.state.showForm ? '0px' : '100px'}
      >
        <IconButton
          background="lighterGrey"
          _hover={{ background: 'lightGrey' }}
          display={this.state.showForm ? 'none' : 'block'}
          aria-label="add a new board"
          icon={<AddIcon />}
          onClick={this.toggleForm}
        />
        <Flex display={this.state.showForm ? 'block' : 'none'}>
          <Formik
            initialValues={{ boardTitle: '' }}
            onSubmit={this.createBoard}
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
                        <Input
                          {...field}
                          id="board-title"
                          isRequired={true}
                          fontSize="sm"
                          variant="flushed"
                          padding="0"
                          maxLength="50"
                          mb="4"
                        />
                        <FormErrorMessage fontSize="xs" mb="4">
                          {form.errors.boardTitle}
                        </FormErrorMessage>
                        <Flex justifyContent="flex-end" width="100%">
                          <IconButton
                            icon={<CloseIcon />}
                            aria-label="Close add board input"
                            size="xs"
                            onClick={this.handlePanelInputClose}
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            ml="4"
                            size="xs"
                            alignSelf="flex-end"
                            colorScheme="blue"
                            isLoading={form.isSubmitting}
                            isDisabled={!form.values.boardTitle}
                          >
                            Add
                          </Button>
                        </Flex>
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
