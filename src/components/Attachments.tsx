import React, { useEffect } from 'react'
import Userfront from '@userfront/core'
import { useParams } from 'react-router-dom'
import {
  Image as ChakraImage,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react'


function ImageFile({ src }: { src: string }) {
  let [image, setImage] = React.useState(new Image())
  let [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })
  useEffect(() => {
    image.src = src
    image.onload = () => {
      setDimensions({
        width: image.width,
        height: image.height,
      })
    }

  })

  return (
    <ChakraImage
      src={src} 
      height={dimensions.height}
      width={dimensions.width}
    />
  )
}

function AttachmentRender() {
  let { attachmentId, filename } = useParams()
  console.log('handling attachment...')
  useEffect(() => {
    // Userfront.tokens?.accessToken
    // Userfront.tokens?.refreshToken
    let fileUrl = `${process.env.REACT_APP_API_URL}/files/attachments/${attachmentId}/${filename}?accessToken=${Userfront.tokens?.accessToken}`
    console.log(fileUrl)
    // @ts-ignore
    // window.location.href = fileUrl
  }, [])

  let fileUrl = `${process.env.REACT_APP_API_URL}/files/attachments/${attachmentId}/${filename}?accessToken=${Userfront.tokens?.accessToken}`

  let fileType = 'image/png'

  switch (fileType) {
    case 'image/png':
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/avif':
    case 'image/svg':
    case 'image/svg+xml': {
      return (
        <Flex>
          <ImageFile src={fileUrl} />
        </Flex>
      )
    }
    default: {
      return (
        <Flex flexDir="column">
          <Text>{fileType} is not supported :( But you can download it anyways!</Text>
          <Button
            onClick={() => {
              window.alert('TODO!')
            }} 
          >

          </Button>
        </Flex>   
      )
    }
  }
}

export function Attachments() {
  return (
    <Flex height="700px" bg="#000" alignItems="center" justifyContent="center">
      <AttachmentRender />
    </Flex>
  )
}