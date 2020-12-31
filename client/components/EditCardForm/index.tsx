import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  Textarea,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import ApiClient from '../../services/ApiClient'
import { AxiosResponse } from 'axios'
import { CloseIcon } from '@chakra-ui/icons'
import { EditCardFormProps } from './types'
import EditCardFormSchema from './schema'
import EditPanel from '../EditPanel/EditPanel'
import React from 'react'

const EditCardForm: React.FC<EditCardFormProps> = (props) => {
  const _closeEditForm = () => {
    props.setShowEditFormState(false)
  }

  const _updateCard = async (
    values: { cardTitle: string; cardDescription: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    const client = new ApiClient()
    const { cardTitle, cardDescription } = EditCardFormSchema.cast({
      ...values,
    })
    setSubmitting(true)

    const resp: AxiosResponse = await client.request(
      'PUT',
      `/card/${props.card.pk}/`,
      {
        data: {
          title: cardTitle,
          description: cardDescription,
          position: props.card.position,
          card_list: props.card.card_list,
        },
        headers: client.setAuthHeader(props.idToken),
      },
      () =>
        setErrors({
          cardTitle: 'Something went wrong, could not update your  card.',
        })
    )

    if (resp.status == 204) {
      await props.setBoardState(props.idToken)
      resetForm()
      setSubmitting(false)
      props.setShowEditFormState(false)
    }
  }

  return (
    <EditPanel display={props.display}>
      <Formik
        initialValues={{
          cardTitle: props.card.title,
          cardDescription: props.card.description,
        }}
        onSubmit={_updateCard}
        validationSchema={EditCardFormSchema}
        enableReinitialize={true}
      >
        {(props) => (
          <Form>
            <Field name="cardTitle">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.cardTitle && form.touched.cardTitle}
                >
                  <Flex
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    flexDirection="column"
                    padding="4"
                    width="450px"
                  >
                    <Flex justifyContent="space-between" width="inherit">
                      <Heading fontSize="md" ml="4">
                        Edit card
                      </Heading>
                      <IconButton
                        icon={<CloseIcon />}
                        aria-label="Close edit card input"
                        size="xs"
                        onClick={_closeEditForm}
                        mr="4"
                      />
                    </Flex>
                    <Divider mt="2" mb="4" width=" 100%" />
                    <Flex mt="4">
                      <Input
                        {...field}
                        id="card-title"
                        isRequired={true}
                        fontSize="sm"
                        p="2"
                        variant="filled"
                        width="350px"
                      />
                    </Flex>
                    <FormErrorMessage
                      alignSelf="flex-start"
                      fontSize="xs"
                      ml="8"
                    >
                      {form.errors.cardTitle}
                    </FormErrorMessage>
                  </Flex>
                </FormControl>
              )}
            </Field>
            <Field name="cardDescription">
              {({ field, form }) => (
                <FormControl
                  isInvalid={
                    form.errors.cardDescription && form.touched.cardDescription
                  }
                >
                  <Flex
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    flexDirection="column"
                    padding="4"
                    width="450px"
                  >
                    <Textarea
                      {...field}
                      id="card-description"
                      isRequired={true}
                      fontSize="sm"
                      padding="2"
                      variant="filled"
                      width="350px"
                      minHeight="200px"
                    />

                    <FormErrorMessage
                      alignSelf="flex-start"
                      fontSize="xs"
                      mb="4"
                      ml="8"
                    >
                      {form.errors.cardDescription}
                    </FormErrorMessage>
                    <Button
                      type="submit"
                      variant="outline"
                      mr="8"
                      mt="8"
                      size="xs"
                      alignSelf="flex-end"
                      colorScheme="blue"
                      isLoading={form.isSubmitting}
                      isDisabled={!form.values.cardDescription}
                    >
                      Edit
                    </Button>
                  </Flex>
                </FormControl>
              )}
            </Field>
          </Form>
        )}
      </Formik>
    </EditPanel>
  )
}

export default EditCardForm
