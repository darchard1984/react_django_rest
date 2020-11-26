import { CSSReset, ThemeProvider } from '@chakra-ui/react'

import Layout from '../components/Layout'
import customTheme from '../theme'

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default App
