import React from 'react'
import { Flex, IconButton, Divider } from '@chakra-ui/react'
import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import ApiClient from '../../services/api'
import { BoardPanelProps, BoardIconProps } from '../BoardPanel/types'

const BoardIcon: React.FC<BoardIconProps> = (props) => {
  const _handleClick = () => {
    props.onIconClick(props.boardId)
  }
  return (
    <IconButton
      alignSelf="flex-end"
      aria-label={props.ariaLabel}
      icon={props.icon}
      size="xs"
      onClick={_handleClick}
      ml="2"
    />
  )
}

export const BoardPanel: React.FC<BoardPanelProps> = (props) => {
  const _handleBoardClose = async (boardId: number) => {
    const client = new ApiClient()

    try {
      const resp = await client.delete(`/board/${boardId}/`, {
        headers: client.setAuthHeader(`${props.user.idToken}`),
      })
      if (resp.status === 204) {
        props.setBoardsState()
      }
    } catch (e) {
      props.setErrorState()
    }
  }

  const _handleBoardLink = (boardId: number) => {
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
      minHeight="200px"
      justifyContent="flex-start"
      alignItems="flex-start"
      flexDirection="column"
      boxShadow="-1px 5px 61px 5px #00000021"
      borderRadius=".3rem"
      padding="4"
    >
      <Flex justifyContent="flex-end" width="100%">
        <BoardIcon
          icon={<ExternalLinkIcon />}
          ariaLabel="board link"
          onIconClick={_handleBoardLink}
          boardId={props.board.pk}
        />
        <BoardIcon
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
