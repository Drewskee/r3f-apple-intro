"use client"

import useElementSize from '@/hooks/useElementSize';
import { createContext, ReactElement } from 'react';


interface ILayoutContext {
    sidebarHeight: number;
    sidebarWidth: number;
    sidebarRef: ((node: HTMLDivElement | null) => void) | null;
    mainContentHeight: number;
    mainContentWidth: number;
    mainContentRef: ((node: HTMLDivElement | null) => void) | null;
}

const initialValues:ILayoutContext = {
    sidebarHeight: 0,
    sidebarWidth: 0,
    sidebarRef: null,
    mainContentHeight: 0,
    mainContentWidth: 0,
    mainContentRef: null,
};

const LayoutContext = createContext<ILayoutContext>(initialValues);

const LayoutContextProvider = ({ children }: {children:ReactElement}) => {
  // We attached the node ref to the component and share the baseRef incase you need to make updates to the DOM
  const [sidebarRef, sidebarSize] = useElementSize();
  const [mainContentRef, mainContentSize] = useElementSize();

  console.log('LayoutContextProvider mainContentWidth:', mainContentSize.width);
  return (
    <LayoutContext.Provider
      value={{
        sidebarHeight: sidebarSize.height,
        sidebarWidth: sidebarSize.width,
        sidebarRef,
        mainContentHeight: mainContentSize.height,
        mainContentWidth: mainContentSize.width,
        mainContentRef,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export { LayoutContextProvider, LayoutContext };