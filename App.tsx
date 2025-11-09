import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Power, Shield, Wifi, ChevronDown, Loader, WifiOff } from 'lucide-react';
import type { ServerLocation, ConnectionStatus } from './types';
import { fetchVpnServers } from './services/geminiService';
import ConnectButton from './components/ConnectButton';
import ServerList from './components/ServerList';
import StatusDisplay from './components/StatusDisplay';
import SpeedChart from './components/SpeedChart';
import WorldMap from './components/WorldMap';

const App: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [servers, setServers] = useState<ServerLocation[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isServerListOpen, setIsServerListOpen] = useState(false);

  const defaultServer = useMemo(() => ({
    city: 'Optimal Location',
    country: 'Automatic',
    flag: '🚀',
    lat: 0,
    lng: 0,
  }), []);

  useEffect(() => {
    const loadServers = async () => {
      try {
        setError(null);
        const fetchedServers = await fetchVpnServers();
        setServers([defaultServer, ...fetchedServers]);
        setSelectedServer(defaultServer);
      } catch (e) {
        console.error("Failed to fetch VPN servers:", e);
        setError("Could not load server locations. Please try again later.");
        setServers([defaultServer]);
        setSelectedServer(defaultServer);
      }
    };
    loadServers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnectToggle = useCallback(() => {
    if (connectionStatus === 'connected' || connectionStatus === 'connecting') {
      setConnectionStatus('disconnecting');
      setTimeout(() => setConnectionStatus('disconnected'), 1500);
    } else {
      if (selectedServer) {
        setConnectionStatus('connecting');
        setTimeout(() => setConnectionStatus('connected'), 2000);
      }
    }
  }, [connectionStatus, selectedServer]);

  const handleServerSelect = useCallback((server: ServerLocation) => {
    if (connectionStatus === 'disconnected') {
      setSelectedServer(server);
    }
    setIsServerListOpen(false);
  }, [connectionStatus]);
  
  return (
    <div className="min-h-screen bg-dark-bg text-light-text flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <header className="flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-brand-blue" />
            <h1 className="text-3xl font-bold ml-3">CyberGhost VPN</h1>
        </header>

        <main className="bg-dark-card rounded-2xl shadow-2xl p-6 border border-dark-border">
          <StatusDisplay status={connectionStatus} server={selectedServer} />

          <WorldMap
            servers={servers.filter(s => s.country !== 'Automatic')}
            selectedServer={selectedServer}
            connectionStatus={connectionStatus}
            onSelect={handleServerSelect}
          />
          
          <div className="my-6 flex justify-center">
            <ConnectButton status={connectionStatus} onClick={handleConnectToggle} />
          </div>

          <div className="relative">
              <button 
                  onClick={() => setIsServerListOpen(!isServerListOpen)}
                  disabled={connectionStatus !== 'disconnected'}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 flex items-center justify-between transition-colors duration-200 hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-dark-border"
              >
                  <div className="flex items-center">
                      <span className="text-2xl mr-3">{selectedServer?.flag}</span>
                      <div>
                          <p className="font-semibold">{selectedServer?.city}</p>
                          <p className="text-sm text-medium-text">{selectedServer?.country}</p>
                      </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-medium-text transition-transform duration-300 ${isServerListOpen ? 'rotate-180' : ''}`} />
              </button>
              {isServerListOpen && (
                <ServerList servers={servers} onSelect={handleServerSelect} />
              )}
          </div>
        </main>
        
        <footer className="mt-6 text-center text-medium-text text-xs">
          <p>This is a UI concept. No real VPN connection is established.</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </footer>

      </div>
    </div>
  );
};

export default App;