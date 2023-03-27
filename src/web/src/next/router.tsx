import React from 'react';

import { useRouter as useNextRouter } from  'next/router';

type RouterProps = ReturnType<typeof useNextRouter> & {
  searchParams: ReturnType<typeof useNextRouter>['query'];
  setSearchParams: (params: Record<string, string>) => void;
};

export function useRouter(): RouterProps {
  
  const router = useNextRouter();

  const setSearchParams = React.useCallback((params: Record<string, string>) => {
    const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
    Object.keys(params).forEach((key) => {
      searchParams.set(key, params[key]);
    });
    router.push({
      pathname: router.pathname,
      query: router.query,
      search: searchParams.toString(),
    });
  }, [router]);

  return {
    ...router,
    searchParams: React.useMemo(() => router.query, [router.query]),
    setSearchParams,
  };
}