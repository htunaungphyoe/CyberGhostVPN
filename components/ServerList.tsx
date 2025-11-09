
import React from 'react';
import type { ServerLocation } from '../types';

interface ServerListProps {
  servers: ServerLocation[];
  onSelect: (server: ServerLocation) => void;
}

const ServerList: React.FC<ServerListProps> = ({ servers, onSelect }) => {
  if (!servers || servers.length === 0) {
    return (
      <div className="absolute top-full mt-2 w-full bg-dark-bg border border-dark-border rounded-lg p-4 text-center text-medium-text">
        Loading servers...
      </div>
    );
  }

  return (
    <div className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto bg-dark-bg border border-dark-border rounded-lg shadow-xl z-10 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-dark-bg">
      <ul>
        {servers.map((server, index) => (
          <li key={`${server.city}-${index}`}>
            <button
              onClick={() => onSelect(server)}
              className="w-full flex items-center px-4 py-3 text-left transition-colors duration-200 hover:bg-dark-card"
            >
              <span className="text-2xl mr-4">{server.flag}</span>
              <div>
                <p className="font-semibold text-light-text">{server.city}</p>
                <p className="text-sm text-medium-text">{server.country}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerList;
