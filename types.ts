export interface ServerLocation {
  city: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';