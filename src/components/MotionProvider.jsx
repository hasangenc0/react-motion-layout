import React, {
  useReducer, useCallback, useEffect, useState, useMemo,
} from 'react';

import PropTypes from 'prop-types';
import { reducer, initialState } from '../state/reducer';

export const GlobalContext = React.createContext();

export default function MotionProvider({ children, debug }) {
  const [store, internalDispatch] = useReducer(reducer, initialState);

  const log = useMemo(() => {
    const disable = (fn) => {
      if (debug) {
        return fn;
      }

      return () => {};
    };
    return {
      error: disable((...params) => console.error(...params)),
      info: disable((...params) => console.info(...params)),
    };
  }, [debug]);


  const dispatch = useCallback((params) => {
    log.info('->', params);
    internalDispatch(params);
  }, [log]);

  const [portal, setPortal] = useState();

  useEffect(() => {
    const [body] = document.getElementsByTagName('body');
    const element = document.createElement('div');
    element.setAttribute('id', 'rose-portal');
    body.appendChild(element);
    setPortal(element);
    log.info('Portal element created');
  }, [log]);

  return (
    <GlobalContext.Provider value={{
      store, dispatch, portal, log,
    }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

MotionProvider.propTypes = {
  children: PropTypes.node.isRequired,
  debug: PropTypes.bool,
};

MotionProvider.defaultProps = {
  debug: false,
};