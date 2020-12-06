import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { AddListProps, AddListState } from './types'
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import AddListSchema from './schema'
import ApiClient from '../../services/api'
import React from 'react'

export class AddList extends React.Component<AddListProps, AddListState> {
  client = new ApiClient()
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
    }
  }

  toggleForm = () => {
    this.state.showForm
      ? this.setState({ showForm: false })
      : this.setState({ showForm: true })
  }

  handlePanelInputClose = () => {
    this.setState({
      showForm: false,
    })
  }

  handleSumbit = async (
    values: { listTitle: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    setSubmitting(true)
    const { listTitle } = AddListSchema.cast({ ...values })

    const resp = await this.client.post(
      '/card-list/',
      {
        data: { title: listTitle, board: this.props.boardId },
      },
      { headers: this.client.setAuthHeader(this.props.idToken) },
      () =>
        setErrors({
          listTitle: 'Something went wrong, could not save your list.',
        })
    )

    if (resp?.status == 201) {
      await this.props.setCardListState()
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
        ml="4"
        mt="2"
        mr="4"
        minWidth="200px"
      >
        <Flex
          height="40px"
          border="1px solid lightGrey"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          borderRadius=".3rem"
          display={this.state.showForm ? 'none' : 'flex'}
          pl="4"
          pr="4"
          background="lighterGrey"
        >
          <Text as="span" mr="4">
            Add a list
          </Text>
          <IconButton
            aria-label="add a new list"
            icon={<AddIcon />}
            onClick={this.toggleForm}
            size="xs"
            background="white"
          />
        </Flex>

        <Flex display={this.state.showForm ? 'block' : 'none'}>
          <Formik
            initialValues={{ listTitle: '' }}
            onSubmit={this.handleSumbit}
            validationSchema={AddListSchema}
          >
            {(props) => (
              <Form>
                <Field name="listTitle">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.listTitle && form.touched.listTitle
                      }
                    >
                      <Flex
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        flexDirection="column"
                        backgroundColor="#fff"
                        boxShadow="-1px 5px 61px 5px #00000021"
                        borderRadius=".3rem"
                        padding="4"
                        width="200px"
                      >
                        <Input
                          {...field}
                          id="list-title"
                          isRequired={true}
                          fontSize="sm"
                          variant=""
                          padding="0"
                          maxLength="50"
                        />
                        <FormErrorMessage fontSize="xs" mb="4">
                          {form.errors.listTitle}
                        </FormErrorMessage>
                        <Divider mb="4" />
                        <Flex justifyContent="flex-end" width="100%">
                          <IconButton
                            aria-label="add a new list"
                            icon={<CloseIcon />}
                            onClick={this.toggleForm}
                            size="xs"
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            ml="4"
                            size="xs"
                            alignSelf="flex-end"
                            colorScheme="blue"
                            isLoading={form.isSubmitting}
                            isDisabled={!form.values.listTitle}
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

export default AddList
