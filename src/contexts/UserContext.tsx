import React, { ReactNode, createContext, useState } from 'react';

// Not sure if this is the correct interface:
import { ILoggedInSolidSession } from '../../lib/solid-auth-fetcher/dist/solidSession/ISolidSession';

interface Context {
  session: ILoggedInSolidSession | undefined;
  setSession: (session: ILoggedInSolidSession | undefined) => void;
  isLoadingSession: Boolean;
  setIsLoadingSession: (isLoading: Boolean) => void;
}

interface ContextProvider {
  children: ReactNode,
}

export const UserContext = createContext<Context>({
  session: undefined,
  setSession: () => {},
  isLoadingSession: true,
  setIsLoadingSession: () => {},
});

export default function UserProvider(props: ContextProvider) {
  const { children } = props;
  const [session, setSession] = useState();
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  return (
    <UserContext.Provider
      value={{
        session,
        setSession,
        isLoadingSession,
        setIsLoadingSession,
      }}
    >
      { children }
    </UserContext.Provider>
  )
}
