import { ThemeProvider, CSSReset } from '@chakra-ui/react'
import customTheme from '../theme'
import Layout from '../components/Layout'

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
