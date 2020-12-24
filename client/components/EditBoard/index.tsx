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
import EditBoardPanelSchema from './schema'
import { EditBoardProps } from './types'
import React from 'react'

const EditBoard: React.FC<EditBoardProps> = (props) => {
  const _closeEditForm = () => {
    props.setShowEditFormState(false)
  }

  const _handleSumbit = async (
    values: { boardTitle: string },
    { setErrors, resetForm, setSubmitting }
  ) => {
    const client = new ApiClient()
    const { boardTitle } = EditBoardPanelSchema.cast({ ...values })
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
    <Flex
      display={props.display ? 'flex' : 'none'}
      width="100vw"
      position="absolute"
      top="0"
      left="0"
      bottom="0"
      height="100vh"
      background="mask"
      zIndex="10"
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        zIndex="11"
        background="#fff"
        position="relative"
        top="-100px"
        borderRadius=".3rem"
      >
        <Formik
          initialValues={{ boardTitle: props.title }}
          onSubmit={_handleSumbit}
          validationSchema={EditBoardPanelSchema}
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
                      padding="4"
                      mb="16"
                      width="450px"
                    >
                      <Flex justifyContent="space-between" width="inherit">
                        <Heading fontSize="md" ml="4">
                          Edit Title
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
      </Flex>
    </Flex>
  )
}

export default EditBoard
