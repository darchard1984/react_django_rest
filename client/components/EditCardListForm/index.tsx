import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import ApiClient from '../../services/api'
import { AxiosResponse } from 'axios'
import { CloseIcon } from '@chakra-ui/icons'
import EditCardListFormPanelSchema from './schema'
import { EditCardListFormProps } from './types'
import EditPanel from '../EditPanel/EditPanel'
import React from 'react'

const EditCardListForm: React.FC<EditCardListFormProps> = (props) => {
  const _closeEditForm = () => {
    props.setShowEditFormState(false)
  }

  const _handleSumbit = async (
    values: { listTitle: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    const client = new ApiClient()
    const { listTitle } = EditCardListFormPanelSchema.cast({ ...values })
    setSubmitting(true)

    const resp: AxiosResponse = await client.put(
      `/card-list/${props.cardList.pk}/`,
      {
        data: { title: listTitle, board: props.cardList.board },
      },
      { headers: client.setAuthHeader(props.idToken) },
      () =>
        setErrors({
          listTitle: 'Something went wrong, could not update your list.',
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
        initialValues={{ listTitle: props.cardList.title }}
        onSubmit={_handleSumbit}
        validationSchema={EditCardListFormPanelSchema}
        enableReinitialize={true}
      >
        {(props) => (
          <Form>
            <Field name="listTitle">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.listTitle && form.touched.listTitle}
                >
                  <Flex
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    flexDirection="column"
                    padding="4"
                    mb="16"
                    width="450px"
                  >
                    <Flex justifyContent="space-between" width="inherit">
                      <Heading fontSize="md" ml="4">
                        Edit card list title
                      </Heading>
                      <IconButton
                        icon={<CloseIcon />}
                        aria-label="Close edit card list form"
                        size="xs"
                        onClick={_closeEditForm}
                        mr="4"
                      />
                    </Flex>
                    <Divider mt="2" mb="4" width=" 100%" />
                    <Flex mt="8">
                      <Input
                        {...field}
                        id="card-title"
                        isRequired={true}
                        fontSize="sm"
                        padding="0"
                        variant="flushed"
                        width="300px"
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
                        Edit
                      </Button>
                    </Flex>
                    <FormErrorMessage
                      alignSelf="flex-start"
                      fontSize="xs"
                      mb="4"
                      ml="8"
                    >
                      {form.errors.listTitle}
                    </FormErrorMessage>
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

export default EditCardListForm
