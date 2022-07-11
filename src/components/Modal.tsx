import React from 'react'
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

interface ModalProps {
  header: React.ReactNode
  content: React.ReactNode
  footer: React.ReactNode
  isOpen: boolean
  handleClose: () => void
}

function Modal({ header, content, footer, isOpen, handleClose }: ModalProps) {
  return (
    <ChakraModal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content}</ModalBody>
      </ModalContent>
      <ModalFooter>{footer}</ModalFooter>
    </ChakraModal>
  )
}

export default Modal
