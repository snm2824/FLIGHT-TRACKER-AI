import React from 'react';
import { FlightData } from '../types';
import { PlaneIcon } from './icons/PlaneIcon';

interface FlightProgressProps {
  flightData: FlightData;
}

export const FlightProgress: React.FC<FlightProgressProps> = ({ flightData }) => {
  const { departure, arrival, progressPercent } = flightData;
  const progress = Math.max(0, Math.min(100, progressPercent));

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="text-left">
          <p className="text-2xl font-bold">{departure.airportCode}</p>
          <p className="text-sm text-slate-400 truncate max-w-xs">{departure.city}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{arrival.airportCode}</p>
          <p className="text-sm text-slate-400 truncate max-w-xs">{arrival.city}</p>
        </div>
      </div>
      <div className="relative w-full h-2 bg-slate-700 rounded-full my-2">
        <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
            style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
          style={{ left: `${progress}%` }}
        >
          <PlaneIcon className="w-6 h-6 text-amber-400 transform -rotate-45" style={{ filter: `drop-shadow(0 0 8px #fbbf24)`}}/>
        </div>
      </div>
       <div className="text-center mt-3">
        <p className="text-slate-300 font-medium">{progress}% of trip completed</p>
      </div>
    </div>
  );
};