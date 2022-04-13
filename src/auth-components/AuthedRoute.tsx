import React from 'react';
import { Navigate } from 'react-router-dom';

export interface AuthedRouteProps {
   isAuthenticated: boolean;
   authenticationPath: string;
   outlet: JSX.Element;
}

const RequireAuth = ({ isAuthenticated, authenticationPath, outlet }: AuthedRouteProps) => {
   if (isAuthenticated) {
      return outlet;
   } else {
      return <Navigate to={{ pathname: authenticationPath }} />;
   }
};

export default RequireAuth;
