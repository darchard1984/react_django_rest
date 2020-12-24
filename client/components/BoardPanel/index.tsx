import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { Divider, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

import ApiClient from '../../services/api'
import { BoardPanelProps } from '../BoardPanel/types'
import EditBoardForm from '../EditBoardForm'
import { FaEdit } from 'react-icons/fa'
import PanelIcon from '../PanelIcon'
import { useRouter } from 'next/router'

const BoardPanel: React.FC<BoardPanelProps> = (props) => {
  const router = useRouter()
  const [showEditForm, _setShowEditForm] = useState(false)

  const _handleBoardDelete = async (boardId: number) => {
    const client = new ApiClient()

    const resp = await client.delete(
      `/board/${boardId}/`,
      {
        headers: client.setAuthHeader(`${props.user.idToken}`),
      },
      props.setErrorState
    )

    if (resp.status === 204) {
      props.setBoardsState()
    }
  }

  const _handleBoardLink = (boardId: number) => {
    router.push(`/board/${boardId}/`)
  }

  const _handleBoardEdit = (boardId: number) => {
    _setShowEditForm(true)
  }

  return (
    <Flex
      mt="8"
      ml="4"
      mr="2"
      mb="4"
      width="200px"
      justifyContent="flex-start"
      alignItems="flex-start"
      flexDirection="column"
      boxShadow="-1px 5px 61px 5px #00000021"
      borderRadius=".3rem"
      padding="4"
      wordBreak="break-word"
      background="lightGrey"
    >
      <Flex justifyContent="flex-end" width="100%">
        <PanelIcon
          icon={<FaEdit />}
          ariaLabel="edit board"
          onIconClick={_handleBoardEdit}
          pk={props.board.pk}
        />
        <PanelIcon
          icon={<ExternalLinkIcon />}
          ariaLabel="go to board"
          onIconClick={_handleBoardLink}
          pk={props.board.pk}
        />
        <PanelIcon
          icon={<CloseIcon />}
          ariaLabel="close board"
          onIconClick={_handleBoardDelete}
          pk={props.board.pk}
        />
      </Flex>
      <Divider mt="2" mb="2" />
      <Text as="span" fontWeight="bold">
        {props.board.title}
      </Text>
      <EditBoardForm
        display={showEditForm}
        title={props.board.title}
        pk={props.board.pk}
        user={props.user}
        setShowEditFormState={_setShowEditForm}
        setBoardsState={props.setBoardsState}
        setErrorState={props.setErrorState}
      />
    </Flex>
  )
}

export default BoardPanel
