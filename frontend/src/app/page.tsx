'use client';

import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Event } from '@/types/event';

export default function Home() {
  const { events, createEvent } = useWebSocket();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      createEvent(message);
      setMessage('');
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Event Dashboard</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter event message"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Event
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-medium">{event.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    event.status
                  )}`}
                >
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
