import { GoogleGenAI, Type } from "@google/genai";
import type { ServerLocation } from '../types';

const fetchVpnServers = async (): Promise<ServerLocation[]> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Returning mock data.");
    return [
      { city: 'Los Angeles', country: 'United States', flag: '🇺🇸', lat: 34.0522, lng: -118.2437 },
      { city: 'London', country: 'United Kingdom', flag: '🇬🇧', lat: 51.5074, lng: -0.1278 },
      { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', lat: 35.6895, lng: 139.6917 },
      { city: 'Sydney', country: 'Australia', flag: '🇦🇺', lat: -33.8688, lng: 151.2093 },
      { city: 'Frankfurt', country: 'Germany', flag: '🇩🇪', lat: 50.1109, lng: 8.6821 },
    ];
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a diverse list of 15 global locations suitable for VPN servers. For each, provide the city, country, a single appropriate country flag emoji, and its latitude and longitude.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            servers: {
              type: Type.ARRAY,
              description: "List of VPN server locations.",
              items: {
                type: Type.OBJECT,
                properties: {
                  city: { type: Type.STRING, description: "The name of the city." },
                  country: { type: Type.STRING, description: "The name of the country." },
                  flag: { type: Type.STRING, description: "A single emoji representing the country's flag." },
                  lat: { type: Type.NUMBER, description: "The latitude of the city." },
                  lng: { type: Type.NUMBER, description: "The longitude of the city." },
                },
                required: ["city", "country", "flag", "lat", "lng"]
              }
            }
          },
          required: ["servers"]
        },
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);
    return parsed.servers as ServerLocation[];
  } catch (error) {
    console.error("Error fetching servers from Gemini API:", error);
    throw new Error("Failed to communicate with Gemini API.");
  }
};

export { fetchVpnServers };