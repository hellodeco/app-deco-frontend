import React from 'react'
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Container,
} from '@chakra-ui/react'
import { SearchIcon, CloseIcon } from '@chakra-ui/icons'
import apiFetch from '../helpers/apiFetch'
import '../App.css'
import './Search.css'

interface IProps {
  activeSearchQuery: string
  setActiveSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export const SearchBar = (props: IProps) => {
  const { setActiveSearchQuery, activeSearchQuery } = props

  const handleSubmitSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    let parsedJson
    let responseStatus

    try {
      // search here
    } catch (err) {
      console.error(err)
    }

    if (responseStatus === 200) {
      // set the search results here
    }
  }

  const handleClearSearch = async () => {
    try {
      setActiveSearchQuery('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container width="100%" padding="0">
      <form onSubmit={(e) => handleSubmitSearch(e)}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.700" />}
          />
          <Input
            bg="#F3F3F3"
            variant="filled"
            type="text"
            onChange={(event) => {
              setActiveSearchQuery(event.target.value)
            }}
            placeholder="Search for app"
            value={activeSearchQuery}
            _hover={{
              background: '#E5E5E5',
            }}
            _focus={{
              background: '#F3F3F3',
            }}
          />
          <InputRightElement
            children={
              <IconButton
                aria-label="Cancel Search"
                bg="#F3F3F3"
                icon={<CloseIcon />}
                onClick={handleClearSearch}
                // borderRadius='md'
                _hover={{
                  background: '#E5E5E5',
                }}
              />
            }
          />
        </InputGroup>
      </form>
    </Container>
  )
}
