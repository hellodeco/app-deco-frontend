import React from 'react';
import { Navigate } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import AccountNav from '../components/AccountNav';
export interface AuthedRouteProps {
   isAuthenticated: boolean;
   authenticationPath: string;
   outlet: JSX.Element;
}

const RequireAuth = ({ isAuthenticated, authenticationPath, outlet }: AuthedRouteProps) => {
   if (isAuthenticated) {
      return (
         <Flex>
            <AccountNav />
            {outlet}
         </Flex>
      );
   } else {
      return <Navigate to={{ pathname: authenticationPath }} />;
   }
};

export default RequireAuth;
