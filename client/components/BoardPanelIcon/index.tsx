import BoardPanel from '../BoardPanel'

import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { BoardPanelIconProps } from './types'

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
    />
  )
}

export default BoardPanelIcon
