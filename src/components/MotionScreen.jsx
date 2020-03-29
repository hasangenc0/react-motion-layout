import React, { useRef, useContext, useEffect } from 'react';
import GlobalContext from '../utils/globalContext';
import randomString from '../utils/randomString';
import actions from '../state/actions';
import useFirstLayoutEffect from '../hooks/useFirstEffect';

export const ScreenContext = React.createContext();

/**
 * Groups multiple scenes together and saves scroll state on navigation
 */
export default function MotionScreen({ children, name }) {
  const nameRef = useRef(name || randomString());
  const { dispatch } = useContext(GlobalContext) || {};

  useFirstLayoutEffect(() => {
    dispatch({ type: actions.view.setScreen, screen: nameRef.current });
  }, [dispatch]);

  useEffect(() => () => {
    const exitScroll = { x: window.scrollX, y: window.scrollY };
    dispatch({ type: actions.view.setExitScroll, exitScroll });
  }, [dispatch]);

  return (
    <ScreenContext.Provider value={{ screenName: nameRef.current }}>
      {children}
    </ScreenContext.Provider>
  );
}
