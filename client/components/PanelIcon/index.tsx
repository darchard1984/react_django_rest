import { IconButton, background } from '@chakra-ui/react'

import { PanelIconProps } from './types'
import React from 'react'

const PanelIcon: React.FC<PanelIconProps> = (props) => {
  const _handleClick = () => {
    props.onIconClick(props.pk)
  }
  return (
    <IconButton
      alignSelf="flex-end"
      aria-label={props.ariaLabel}
      icon={props.icon}
      size="xs"
      width="1rem"
      onClick={_handleClick}
      ml="1"
      background={props.background ? props.background : 'lightGrey'}
      color={props.color ? props.color : '#000'}
      _hover={props._hover ? props._hover : { background: 'lightGrey' }}
    />
  )
}

export default PanelIcon
