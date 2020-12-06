import { AddCardProps, AddCardState } from './types'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import AddCardSchema from './schema'
import ApiClient from '../../services/api'
import React from 'react'

export class AddCard extends React.Component<AddCardProps, AddCardState> {
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
    values: { cardTitle: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    setSubmitting(true)
    const { cardTitle, cardDescription } = AddCardSchema.cast({ ...values })

    const resp = await this.client.post(
      '/card/',
      {
        data: {
          title: cardTitle,
          description: cardDescription,
          position: 1,
          card_list: this.props.cardListId,
        },
      },
      { headers: this.client.setAuthHeader(this.props.idToken) },
      () =>
        setErrors({
          listTitle: 'Something went wrong, could not save your list.',
        })
    )

    if (resp?.status == 201) {
      // await this.props.setCardListState()
      resetForm()
      setSubmitting(false)
      this.setState({
        showForm: false,
      })
      console.log(resp)
    }
  }

  render() {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minWidth="200px"
      >
        <Flex
          height="40px"
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
            Add a card
          </Text>
          <IconButton
            aria-label="add a new list"
            icon={<AddIcon />}
            onClick={this.toggleForm}
            size="xs"
            background="white"
          />
        </Flex>

        <Flex
          display={this.state.showForm ? 'flex' : 'none'}
          justifyContent="flex-start"
          alignItems="center"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="-1px 5px 61px 5px #00000021"
          borderRadius=".3rem"
          padding="4"
          width="200px"
        >
          <Formik
            initialValues={{ cardTitle: '', cardDescription: '' }}
            onSubmit={this.handleSumbit}
            validationSchema={AddCardSchema}
          >
            {(props) => (
              <Form>
                <Field name="cardTitle">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.cardTitle && form.touched.cardTitle
                      }
                    >
                      <Input
                        {...field}
                        id="card-title"
                        isRequired={true}
                        fontSize="sm"
                        variant="filled"
                        padding="2"
                        mb="2"
                        placeholder="Title"
                      />
                      <FormErrorMessage fontSize="xs" mb="4">
                        {form.errors.cardTitle}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="cardDescription">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.cardDescription &&
                        form.touched.cardDescription
                      }
                    >
                      <Textarea
                        {...field}
                        id="card-description"
                        isRequired={true}
                        fontSize="sm"
                        variant="filled"
                        padding="2"
                        placeholder="Description"
                        mb="2"
                        minHeight="100px"
                      />
                      <FormErrorMessage fontSize="xs" mb="4">
                        {form.errors.cardDescription}
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
                          isDisabled={
                            !form.values.cardTitle ||
                            !form.values.cardDescription
                          }
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

export default AddCard
