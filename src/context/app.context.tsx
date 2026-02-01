"use client"

import useElementSize from '@/hooks/useElementSize';
import { createContext, ReactElement } from 'react';
import { useControls } from 'leva'
import { ORBITCTRLS_ENABLE_ZOOM, ORBITCTRLS_ENABLE_PAN, ORBITCTRLS_AUTO_ROTATE, ORBITCTRLS_MIN_POLAR_ANGLE, ORBITCTRLS_MAX_POLAR_ANGLE } from '@/lib/constants';
import { or } from 'three/tsl';


interface IAppContext {
    orbitCtrlEnableZoom?: boolean;
    orbitCtrlEnablePan?: boolean;
    orbitCtrlAutoRotate?: boolean;
    orbitCtrlMinPolarAngle?: number;
    orbitCtrlMaxPolarAngle?: number;
}

const initialValues:IAppContext = {
    orbitCtrlEnableZoom: ORBITCTRLS_ENABLE_ZOOM,
    orbitCtrlEnablePan: ORBITCTRLS_ENABLE_PAN,
    orbitCtrlAutoRotate: ORBITCTRLS_AUTO_ROTATE,
    orbitCtrlMinPolarAngle: ORBITCTRLS_MIN_POLAR_ANGLE,
    orbitCtrlMaxPolarAngle: ORBITCTRLS_MAX_POLAR_ANGLE,
};

const AppContext = createContext<IAppContext>(initialValues);

const AppContextProvider = ({ children }: {children:ReactElement}) => {
  // We attached the node ref to the component and share the baseRef incase you need to make updates to the DOM
  const { orbitCtrlEnableZoom, orbitCtrlEnablePan, orbitCtrlAutoRotate, orbitCtrlMinPolarAngle, orbitCtrlMaxPolarAngle } = useControls({ orbitCtrlEnableZoom: ORBITCTRLS_ENABLE_ZOOM, orbitCtrlEnablePan: ORBITCTRLS_ENABLE_PAN, orbitCtrlAutoRotate: ORBITCTRLS_AUTO_ROTATE, orbitCtrlMinPolarAngle: ORBITCTRLS_MIN_POLAR_ANGLE, orbitCtrlMaxPolarAngle: ORBITCTRLS_MAX_POLAR_ANGLE });

  return (
    <AppContext.Provider
      value={{
        orbitCtrlEnableZoom,
        orbitCtrlEnablePan,
        orbitCtrlAutoRotate,
        orbitCtrlMinPolarAngle,
        orbitCtrlMaxPolarAngle
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };