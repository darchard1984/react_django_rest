import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import { LayoutProps } from './types'
import Nav from '../Nav'
import React from 'react'

export const HeadInner: React.FC<LayoutProps> = ({
  title = 'Lystly | Home',
  description = 'A Trello-esque demo app',
}: LayoutProps) => {
  return (
    <React.Fragment>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href="/favicon.ico" />
    </React.Fragment>
  )
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Lystly | Home',
  description = 'A Trello-esque demo app',
}: LayoutProps) => {
  return (
    <React.Fragment>
      <Head>
        <HeadInner title={title} description={description} />
      </Head>
      <Nav />
      <Box>{children}</Box>
    </React.Fragment>
  )
}

export default Layout
