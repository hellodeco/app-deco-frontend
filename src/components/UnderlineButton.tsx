import React from 'react';
import { Button } from '@chakra-ui/react';

interface UnderlineButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  leftIcon?: React.ReactElement;
}

function UnderlineButton({ children, ...rest }: UnderlineButtonProps) {
  return (
    <Button
      textDecor="underline"
      variant="ghost"
      _hover={{
        textDecor: "none"
      }}
      pl="0px"
      pr="9px"
      {...rest}
    >
      {children}
    </Button>
  );
}

export default UnderlineButton;

