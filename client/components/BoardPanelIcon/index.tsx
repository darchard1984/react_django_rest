import { BoardPanelIconProps } from './types'
import { IconButton } from '@chakra-ui/react'
import React from 'react'

const BoardPanelIcon: React.FC<BoardPanelIconProps> = (props) => {
  const _handleClick = () => {
    props.onIconClick(props.boardId)
  }
  return (
    <IconButton
      alignSelf="flex-end"
      aria-label={props.ariaLabel}
      icon={props.icon}
      size="xs"
      width="1rem"
      onClick={_handleClick}
      ml="2"
      background="lightGrey"
      _hover={{ background: 'lightGrey' }}
    />
  )
}

export default BoardPanelIcon
