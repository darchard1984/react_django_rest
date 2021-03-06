import { AddCardListProps, AddCardListState, CardList } from './types'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import AddCardListSchema from './schema'
import ApiClient from '../../services/ApiClient'
import { AxiosResponse } from 'axios'
import React from 'react'

export class AddCardList extends React.Component<
  AddCardListProps,
  AddCardListState
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
    this.state.showForm
      ? this.setState({ showForm: false })
      : this.setState({ showForm: true })
  }

  handlePanelInputClose = () => {
    this.setState({
      showForm: false,
    })
  }

  createCardList = async (
    values: { listTitle: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    setSubmitting(true)
    const { listTitle } = AddCardListSchema.cast({ ...values })

    const resp: AxiosResponse<CardList> = await this.client.request(
      'POST',
      '/card-list/',
      {
        data: { title: listTitle, board: this.props.boardId },
        headers: this.client.setAuthHeader(this.props.idToken),
      },
      () =>
        setErrors({
          listTitle: 'Something went wrong, could not save your list.',
        })
    )

    if (resp.status == 201) {
      await this.props.setBoardState(this.props.idToken)
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
            onSubmit={this.createCardList}
            validationSchema={AddCardListSchema}
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
                        boxShadow="-1px 5px 8px 5px #00000021"
                        borderRadius=".3rem"
                        padding="4"
                        width="200px"
                      >
                        <Input
                          {...field}
                          id="list-title"
                          isRequired={true}
                          fontSize="sm"
                          variant="flushed"
                          padding="0"
                          maxLength="50"
                          mb="4"
                        />
                        <FormErrorMessage fontSize="xs" mb="4">
                          {form.errors.listTitle}
                        </FormErrorMessage>

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

export default AddCardList
