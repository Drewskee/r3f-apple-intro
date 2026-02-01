"use client"

import useElementSize from '@/hooks/useElementSize';
import { createContext, ReactElement } from 'react';


interface IAppContext {
    sidebarHeight: number;
}

const initialValues:IAppContext = {
    sidebarHeight: 0,
};

const AppContext = createContext<IAppContext>(initialValues);

const AppContextProvider = ({ children }: {children:ReactElement}) => {
  // We attached the node ref to the component and share the baseRef incase you need to make updates to the DOM
  const [sidebarRef, sidebarSize] = useElementSize();
  const [mainContentRef, mainContentSize] = useElementSize();

  return (
    <AppContext.Provider
      value={{
        sidebarHeight: sidebarSize.height,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };