import { ThemeProvider, CSSReset } from '@chakra-ui/react'
import customTheme from '../theme'

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App
