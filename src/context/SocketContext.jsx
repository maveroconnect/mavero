import React, { createContext, useContext, useEffect, useState } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // TODO: initialize socket connection
    console.log('SocketProvider mounted');
    return () => {
      if (socket) socket.disconnect?.();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);