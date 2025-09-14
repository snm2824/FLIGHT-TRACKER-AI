import React, { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { FlightDetails } from './components/FlightDetails';
import { FlightImage } from './components/FlightImage';
import { FlightProgress } from './components/FlightProgress';
import { fetchFlightData } from './services/geminiService';
import { FlightData } from './types';
import { PlaneIcon } from './components/icons/PlaneIcon';

const App: React.FC = () => {
  const [flightNumberInput, setFlightNumberInput] = useState<string>('');
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!flightNumberInput.trim()) {
      setError('Please enter a flight number or call sign.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFlightData(null);

    try {
      const data = await fetchFlightData(flightNumberInput);
      setFlightData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [flightNumberInput]);

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <PlaneIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              Flight Tracker AI
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Enter a flight number or call sign to get real-time status and AI-generated visuals.
          </p>
        </header>

        <main>
          <SearchBar
            value={flightNumberInput}
            onChange={(e) => setFlightNumberInput(e.target.value)}
            onSubmit={handleSearch}
            isLoading={isLoading}
          />

          <div className="mt-8">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                <p className="mt-4 text-slate-300">Fetching real-time flight data...</p>
              </div>
            )}

            {error && (
              <div className="text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 font-semibold">Error</p>
                <p className="text-slate-300 mt-2">{error}</p>
              </div>
            )}

            {!isLoading && !error && flightData && (
              <div className="animate-fade-in-up space-y-8">
                <FlightImage flightData={flightData} />
                <FlightProgress flightData={flightData} />
                <FlightDetails flightData={flightData} />
              </div>
            )}

            {!isLoading && !error && !flightData && (
              <div className="text-center p-12 bg-slate-800/50 rounded-lg border border-slate-700">
                <h2 className="text-2xl font-semibold text-slate-300">Ready for Takeoff</h2>
                <p className="text-slate-400 mt-2">Your flight information will appear here.</p>
              </div>
            )}
          </div>
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Powered by Gemini and React. For informational purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;