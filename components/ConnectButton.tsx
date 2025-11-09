
import React from 'react';
import { Power, Loader, Check, X } from 'lucide-react';
import type { ConnectionStatus } from '../types';

interface ConnectButtonProps {
  status: ConnectionStatus;
  onClick: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ status, onClick }) => {
  const isConnecting = status === 'connecting' || status === 'disconnecting';

  const baseClasses = "relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4";

  const statusConfig = {
    disconnected: {
      bgColor: 'bg-gray-700',
      ringColor: 'focus:ring-gray-500',
      borderColor: 'border-gray-600',
      icon: <Power size={64} />,
      text: 'Connect',
      textColor: 'text-light-text'
    },
    connecting: {
      bgColor: 'bg-blue-600',
      ringColor: 'focus:ring-blue-400',
      borderColor: 'border-blue-500',
      icon: <Loader size={64} className="animate-spin" />,
      text: 'Connecting...',
      textColor: 'text-light-text'
    },
    connected: {
      bgColor: 'bg-brand-green',
      ringColor: 'focus:ring-green-400',
      borderColor: 'border-green-400',
      icon: <Power size={64} />,
      text: 'Disconnect',
      textColor: 'text-dark-bg'
    },
    disconnecting: {
      bgColor: 'bg-red-600',
      ringColor: 'focus:ring-red-400',
      borderColor: 'border-red-500',
      icon: <Loader size={64} className="animate-spin" />,
      text: 'Disconnecting...',
      textColor: 'text-light-text'
    }
  };

  const currentConfig = statusConfig[status];

  return (
    <button
      onClick={onClick}
      disabled={isConnecting}
      className={`${baseClasses} ${currentConfig.bgColor} ${currentConfig.ringColor} border-8 ${currentConfig.borderColor} ${currentConfig.textColor}`}
      aria-label={currentConfig.text}
    >
      <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
      <div className="absolute inset-2 rounded-full border-2 border-white/10"></div>
      
      <div className="z-10 flex flex-col items-center">
        {currentConfig.icon}
        <span className="mt-2 font-semibold text-lg">{currentConfig.text}</span>
      </div>
    </button>
  );
};

export default ConnectButton;
