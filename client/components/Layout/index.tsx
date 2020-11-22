import Head from 'next/head'
import { Box } from '@chakra-ui/react'
import React from 'react'
import { LayoutProps } from './types'
import Nav from '../Nav'

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Lystly | Home',
  description = 'A Trello-esque demo app',
}: LayoutProps) => {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <Box>{children}</Box>
    </React.Fragment>
  )
}

export default Layout
