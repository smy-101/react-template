import React, {type ReactNode, Suspense} from 'react';

export const lazyLoad = (Component: React.LazyExoticComponent<() => ReactNode>) => {
  return <>
    <Suspense>
      <Component />
    </Suspense>
  </>
};
