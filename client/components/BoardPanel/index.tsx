import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { Divider, Flex } from '@chakra-ui/react'

import ApiClient from '../../services/api'
import BoardPanelIcon from '../BoardPanelIcon'
import { BoardPanelProps } from '../BoardPanel/types'
import React from 'react'
import { useRouter } from 'next/router'

const BoardPanel: React.FC<BoardPanelProps> = (props) => {
  const router = useRouter()

  const _handleBoardClose = async (boardId: number) => {
    const client = new ApiClient()

    const resp = await client.delete(
      `/board/${boardId}/`,
      {
        headers: client.setAuthHeader(`${props.user.idToken}`),
      },
      props.setErrorState
    )

    if (resp?.status === 204) {
      props.setBoardsState()
    }
  }

  const _handleBoardLink = (boardId: number) => {
    router.push(`/board/${boardId}/`)
    console.log(boardId)
  }

  return (
    <Flex
      backgroundColor="#fff"
      mt="8"
      ml="4"
      mr="4"
      mb="4"
      width="200px"
      minHeight="150px"
      justifyContent="flex-start"
      alignItems="flex-start"
      flexDirection="column"
      boxShadow="-1px 5px 61px 5px #00000021"
      borderRadius=".3rem"
      padding="4"
    >
      <Flex justifyContent="flex-end" width="100%">
        <BoardPanelIcon
          icon={<ExternalLinkIcon />}
          ariaLabel="board link"
          onIconClick={_handleBoardLink}
          boardId={props.board.pk}
        />
        <BoardPanelIcon
          icon={<CloseIcon />}
          ariaLabel="close board"
          onIconClick={_handleBoardClose}
          boardId={props.board.pk}
        />
      </Flex>
      <Divider mt="2" mb="2" />
      {props.board.title}
    </Flex>
  )
}

export default BoardPanel
