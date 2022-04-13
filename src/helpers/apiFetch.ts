function apiFetch(url: string, init: RequestInit = {}) {
   const defaultHeaders = {
      'Content-Type': 'application/json',
   };

   const reqInit: RequestInit = {
      ...init,
      headers: {
         ...defaultHeaders,
         ...init.headers,
      },
   };

   return fetch(`${process.env.REACT_APP_API_URL}${url}`, reqInit);
}

export default apiFetch;
