
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, ShieldCheck } from 'lucide-react';
import type { ConnectionStatus, ServerLocation } from '../types';

interface StatusDisplayProps {
  status: ConnectionStatus;
  server: ServerLocation | null;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, server }) => {
  const [timer, setTimer] = useState(0);
  const [ipAddress, setIpAddress] = useState<string>('127.0.0.1');

  useEffect(() => {
    let interval: number | undefined;
    if (status === 'connected') {
      // Generate a plausible fake public IP
      setIpAddress(
        [...Array(4)].map(() => Math.floor(Math.random() * 255) + 1).join('.')
      );
      interval = window.setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setTimer(0);
      setIpAddress('127.0.0.1');
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const statusConfig = {
    disconnected: { text: 'Not Connected', color: 'text-red-500', icon: <WifiOff className="w-5 h-5 mr-2" /> },
    connecting: { text: 'Connecting...', color: 'text-blue-400', icon: <Wifi className="w-5 h-5 mr-2 animate-pulse" /> },
    connected: { text: 'Connected & Secure', color: 'text-brand-green', icon: <ShieldCheck className="w-5 h-5 mr-2" /> },
    disconnecting: { text: 'Disconnecting...', color: 'text-yellow-500', icon: <WifiOff className="w-5 h-5 mr-2 animate-pulse" /> },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="text-center">
      <div className={`flex items-center justify-center font-semibold text-lg ${currentStatus.color}`}>
        {currentStatus.icon}
        <span>{currentStatus.text}</span>
      </div>
      <div className="text-medium-text text-sm mt-2">
        {status === 'connected' ? (
          <>
            <p>IP Address: <span className="font-mono text-light-text">{ipAddress}</span></p>
            <p>Duration: <span className="font-mono text-light-text">{formatTime(timer)}</span></p>
          </>
        ) : (
          <p>Your connection is not private.</p>
        )}
      </div>
    </div>
  );
};

export default StatusDisplay;
