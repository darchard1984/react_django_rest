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
import EditBoardFormPanelSchema from './schema'
import { EditBoardFormProps } from './types'
import EditPanel from '../EditPanel/EditPanel'
import React from 'react'

const EditBoardForm: React.FC<EditBoardFormProps> = (props) => {
  const _closeEditForm = () => {
    props.setShowEditFormState(false)
  }

  const _handleSumbit = async (
    values: { boardTitle: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    const client = new ApiClient()
    const { boardTitle } = EditBoardFormPanelSchema.cast({ ...values })
    setSubmitting(true)

    const resp: AxiosResponse = await client.put(
      `/board/${props.pk}/`,
      {
        data: { title: boardTitle, user: props.user.pk },
      },
      { headers: client.setAuthHeader(props.user.idToken) },
      () =>
        setErrors({
          boardTitle: 'Something went wrong, could not update your board.',
        })
    )

    if (resp.status == 204) {
      await props.setBoardsState()
      resetForm()
      setSubmitting(false)
      props.setShowEditFormState(false)
    }
  }

  return (
    <EditPanel
      display={props.display}
      setShowEditFormState={props.setShowEditFormState}
    >
      <Formik
        initialValues={{ boardTitle: props.title }}
        onSubmit={_handleSumbit}
        validationSchema={EditBoardFormPanelSchema}
        enableReinitialize={true}
      >
        {(props) => (
          <Form>
            <Field name="boardTitle">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.boardTitle && form.touched.boardTitle}
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
                        Edit board title
                      </Heading>
                      <IconButton
                        icon={<CloseIcon />}
                        aria-label="Close edit board input"
                        size="xs"
                        onClick={_closeEditForm}
                        mr="4"
                      />
                    </Flex>
                    <Divider mt="2" mb="4" width=" 100%" />
                    <Flex mt="8">
                      <Input
                        {...field}
                        id="board-title"
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
                        isDisabled={!form.values.boardTitle}
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
                      {form.errors.boardTitle}
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

export default EditBoardForm
