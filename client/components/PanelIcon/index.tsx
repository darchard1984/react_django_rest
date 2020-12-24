import { IconButton } from '@chakra-ui/react'
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
      background="lightGrey"
      _hover={{ background: 'lightGrey' }}
    />
  )
}

export default PanelIcon
