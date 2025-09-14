export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FlightData {
  flightNumber: string;
  airline: string;
  status: string;
  progressPercent: number; // 0-100
  departure: {
    airportCode: string;
    airportName: string;
    city: string;
    country: string;
    scheduledTime: string;
    actualTime: string;
    terminal: string;
    gate: string;
    coordinates: Coordinates;
    timezone: string; // IANA time zone name e.g. "America/New_York"
  };
  arrival: {
    airportCode: string;
    airportName: string;
    city: string;
    country: string;
    scheduledTime: string;
    actualTime: string;
    terminal: string;
    gate: string;
    coordinates: Coordinates;
    timezone: string; // IANA time zone name e.g. "Europe/London"
  };
  currentPosition: Coordinates;
}