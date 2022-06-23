import { useMemo } from 'react'
import { useLocation } from 'react-router-dom';

export function useQuery() {
  const { search } = useLocation();
  console.log({ search })

  return useMemo(() => new URLSearchParams(search), [search]);
}