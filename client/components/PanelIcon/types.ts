export type PanelIconProps = {
  pk: number
  icon: any
  ariaLabel: string
  onIconClick: (pk: number) => void
  background?: string
  color?: string
  _hover?: { [k: string]: string }
}
