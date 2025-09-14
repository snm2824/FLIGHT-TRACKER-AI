import React, { useState, useEffect } from 'react';
import { FlightData } from '../types';
import { generateFlightImage } from '../services/geminiService';

interface FlightImageProps {
  flightData: FlightData;
}

export const FlightImage: React.FC<FlightImageProps> = ({ flightData }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      setIsLoading(true);
      setError(null);
      setImageUrl(null);

      let prompt = '';
      const { status, airline, departure, arrival } = flightData;

      if (status === 'En Route') {
        prompt = `Photorealistic, dramatic, wide-angle aerial shot of a ${airline} airplane, recognizable livery, flying high above picturesque clouds. The sun is shining brightly, creating a beautiful lens flare effect.`;
      } else if (status === 'Landed') {
        prompt = `A beautiful, photorealistic, wide-angle photograph of the exterior of ${arrival.airportName} (${arrival.airportCode}) in ${arrival.city}, ${arrival.country}. Show the main terminal building from the outside on a clear, sunny day.`;
      } else { // Scheduled, Delayed, etc.
        prompt = `A beautiful, photorealistic, wide-angle photograph of the exterior of ${departure.airportName} (${departure.airportCode}) in ${departure.city}, ${departure.country}. Show the main terminal building from the outside on a clear, sunny day.`;
      }

      try {
        const url = await generateFlightImage(prompt);
        setImageUrl(url);
      } catch (err) {
        setError('Could not generate flight image.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [flightData]);

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 shadow-lg">
      <div className="relative w-full aspect-video bg-slate-800 rounded-md overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-slate-300">Generating flight image...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {imageUrl && !isLoading && (
          <img
            src={imageUrl}
            alt={`AI-generated image for flight ${flightData.flightNumber}`}
            className="w-full h-full object-cover animate-fade-in"
          />
        )}
         <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }`}</style>
      </div>
    </div>
  );
};