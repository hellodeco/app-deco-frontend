import { useState, useEffect } from 'react';
import { authedRequest } from '../helpers/authedRequest';
import type { User, UserMetaData } from '../types/types';
import Userfront from '@userfront/core';

export function useUserData() {
   const [userData, setUserData] = useState<User>();

   useEffect(() => {
      const fetchInitialUserData = async () => {
         if (!Userfront.accessToken()) {
            return;
         }

         const userMeta = await authedRequest<UserMetaData>({
            route: '/api/user_meta/current',
         });

         if (userMeta) {
            setUserData({
               shareable_url_hash: userMeta.shareable_url_hash,
            });
         }

         return;
      };
      fetchInitialUserData();
      /**
       * We need to pass an empty array here to ensure that this code gets called exactly one time
       */
   }, []);

   return {
      userData,
      setUserData,
   };
}
