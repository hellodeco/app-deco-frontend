import React from 'react'
import { Box } from '@chakra-ui/react'

interface LayoutWrapperProps {
  children: React.ReactNode
}

function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <Box maxW="920px" maxH="700px" mx="auto" mt="60px">
      {children}
    </Box>
  )
}

export default LayoutWrapper
