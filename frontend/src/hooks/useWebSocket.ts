import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Event } from '@/types/event';

const SOCKET_URL = 'http://localhost:3001';

export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('events', (initialEvents: Event[]) => {
      setEvents(initialEvents);
    });

    newSocket.on('newEvent', (event: Event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
    });

    newSocket.on('eventUpdate', (updatedEvent: Event) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createEvent = async (message: string) => {
    if (socket) {
      socket.emit('createEvent', message);
    }
  };

  return { events, createEvent };
}; 