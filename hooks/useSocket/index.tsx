import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

/**
 * Custom hook to establish a socket connection with a given server URL and namespace.
 *
 * @function
 * @param {string} serverUrl - The base URL of the server to connect to.
 * @param {string} namespace - The specific namespace for the socket connection.
 * @returns {Socket|null} The established socket connection, or null if not yet connected.
 *
 * @example
 *
 * const socket = useSocket('http://your-backend-domain.com', '/auction');
 *
 * if (socket) {
 *   socket.on('event-name', data => {
 *     // Handle the event data
 *   });
 * }
 */
const useSocket = (serverUrl: string, namespace: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(`${serverUrl}${namespace}`, {
      withCredentials: false,
      transports: ['websocket'],
      timeout: 1000000,
    });
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [namespace, serverUrl]);

  return socket;
};

export default useSocket;
