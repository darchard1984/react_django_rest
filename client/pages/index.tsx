import Head from 'next/head'
import React from 'react'

import {
  Flex,
  Input,
  Box,
  FormControl,
  FormLabel,
  Button,
} from '@chakra-ui/react'

export default class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div>
        <Head>
          <title>Lystly</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Flex
          as="nav"
          fontFamily="system"
          fontWeight="bold"
          fontSize="md"
          width="100%"
          height="60px"
          justifyContent="flex-start"
          alignItems="center"
          boxShadow="5px -8px 15px 5px rgba(0,0,0,0.22)"
        >
          <Box ml="8">Lystly</Box>
        </Flex>
        <Flex
          justifyContent="center"
          height={[
            'calc(100vh - 120px)',
            'calc(100vh - 120px)',
            'calc(100vh - 240px)',
          ]}
          alignItems="center"
        >
          <FormControl width={['80%', '400px']}>
            <FormLabel mb="12" fontSize="lg">
              Let's start by giving your board a title.
            </FormLabel>
            <Flex>
              <Input
                isRequired={true}
                fontSize="md"
                type="text"
                variant="flushed"
              ></Input>
              <Button
                variant="outline"
                ml={['4', '8']}
                size="sm"
                alignSelf="flex-end"
                colorScheme="blue"
              >
                Done
              </Button>
            </Flex>
          </FormControl>
        </Flex>
      </div>
    )
  }
}
