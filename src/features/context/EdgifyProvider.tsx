import React, { useReducer } from 'react';
import { edgifyReducer } from '@/features/model/reducer';
import { createInitialState } from '@/features/model/initial-state';
import { createActions } from '@/features/model/actions';
import { EdgifyContext } from '@/features/context/EdgifyContext';
import { ActionType, StoreState } from '@/shared/types/core';

export const EdgifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<StoreState, ActionType>>(edgifyReducer, createInitialState());
  const actions = createActions(dispatch);

  return (
    <EdgifyContext.Provider
      value={{
        state,
        dispatch,
        ...actions,
      }}
    >
      {children}
    </EdgifyContext.Provider>
  );
};
