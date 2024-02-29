import React from 'react';

import { useRouter as useNextRouter } from  'next/router';

type RouterProps = ReturnType<typeof useNextRouter> & {
  searchParams: URLSearchParams;
  setSearchParams: (params: Record<string, string> | ((prev?: Record<string, string>) => Record<string, string> | undefined)) => void;
};

export function useRouter(): RouterProps {
  
  const router = useNextRouter();

  const searchParams = React.useMemo(() => new URLSearchParams(router.asPath.split('?')[1]), [router.asPath]);

  const setSearchParams = React.useCallback((params?: Record<string, string> | ((prev?: Record<string, string>) => Record<string, string> | undefined)) => {
    const prevParams = Object.fromEntries(searchParams);
    const newParams = params instanceof Function ? params(prevParams) : params;
    router.push({
      pathname: router.pathname,
      query: router.query,
      search: new URLSearchParams({
        ...prevParams,
        ...newParams,
      }).toString(),
    });
  }, [router, searchParams]);

  return {
    ...router,
    searchParams,
    setSearchParams,
  };
}