import { AddBoardPanelProps, AddBoardState } from './types'
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
import { BoardFormState } from '../../components/FirstBoardForm/types'
import React from 'react'
import createBoard from '../../services/Board'

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

  _createBoard = async (
    values: BoardFormState,
    { setErrors, resetForm, setSubmitting }
  ) => {
    setSubmitting(true)
    const { boardTitle } = AddBoardPanelSchema.cast({ ...values })

    const resp = await createBoard(boardTitle, this.props.user, () => {
      setErrors({
        boardTitle:
          'Something went wrong, we could not save your board at this time.',
      })
    })

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
          data-testid="show-add-board-form"
        />
        <Flex
          display={this.state.showForm ? 'block' : 'none'}
          data-testid="add-board-form"
        >
          <Formik
            initialValues={{ boardTitle: '' }}
            onSubmit={this._createBoard}
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
                          data-testid="add-board-form-input"
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
                            data-testid="close-form"
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
                            data-testid="add-board-form-submit"
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
