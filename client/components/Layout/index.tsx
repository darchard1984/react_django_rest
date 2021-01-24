import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import { LayoutProps } from './types'
import Nav from '../Nav'
import React from 'react'

export const HeadContent: React.FC<LayoutProps> = (props) => {
  return (
    <Head>
      <title>{props.title}</title>
      <meta charSet="utf-8" />
      <meta name="description" content={props.description} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Lystly | Home',
  description = 'A Trello-esque demo app',
}: LayoutProps) => {
  return (
    <React.Fragment>
      <HeadContent title={title} description={description} />
      <Nav />
      <Box>{children}</Box>
    </React.Fragment>
  )
}

export default Layout
