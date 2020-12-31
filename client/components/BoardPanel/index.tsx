import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { Divider, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

import ApiClient from '../../services/ApiClient'
import { BoardPanelProps } from '../BoardPanel/types'
import EditBoardForm from '../EditBoardForm'
import { FaEdit } from 'react-icons/fa'
import PanelIcon from '../PanelIcon'
import { useRouter } from 'next/router'

const BoardPanel: React.FC<BoardPanelProps> = (props) => {
  const router = useRouter()
  const [showEditForm, _setShowEditForm] = useState(false)

  const _deleteBoard = async (boardId: number) => {
    const client = new ApiClient()

    const resp = await client.request(
      'DELETE',
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

  const _goToBoard = (boardId: number) => {
    router.push(`/board/${boardId}/`)
  }

  const _editBoard = (boardId: number) => {
    _setShowEditForm(true)
  }

  return (
    <Flex
      my="2"
      mx="4"
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
          icon={<ExternalLinkIcon />}
          ariaLabel="go to board"
          onIconClick={_goToBoard}
          pk={props.board.pk}
        />
        <PanelIcon
          icon={<FaEdit />}
          ariaLabel="edit board"
          onIconClick={_editBoard}
          pk={props.board.pk}
        />
        <PanelIcon
          icon={<CloseIcon />}
          ariaLabel="close board"
          onIconClick={_deleteBoard}
          pk={props.board.pk}
        />
      </Flex>
      <Divider mt="2" mb="2" />
      <Text as="span" fontWeight="bold">
        {props.board.title}
      </Text>
      <EditBoardForm
        display={showEditForm}
        board={props.board}
        user={props.user}
        setShowEditFormState={_setShowEditForm}
        setBoardsState={props.setBoardsState}
        setErrorState={props.setErrorState}
      />
    </Flex>
  )
}

export default BoardPanel
