import { theme } from '@chakra-ui/react'

const myTheme = {
  ...theme,
  fonts: {
    ...theme.fonts,
    system:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
  fontSizes: {
    xs: '.8rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
    xxl: '3.5rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  colors: {
    ...theme.colors,
    lightGrey: '#e0e0e0',
    lighterGrey: '#f5f5f5',
    boardPanelBackground: '#b5b5b5',
    cardBackground: '#000',
    errorRed: '#ff00002b',
    mask: '#0000007a',
  },
}

export default myTheme
