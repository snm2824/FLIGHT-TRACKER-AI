import React from 'react';
import { FlightData } from '../types';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface FlightDetailsProps {
  flightData: FlightData;
}

const formatDate = (dateString: string, timeZone: string): string => {
  if (!dateString || dateString === 'N/A' || !timeZone || timeZone === 'N/A') return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone,
    });
  } catch (err) {
    console.error(`Failed to format date for ${timeZone}`, err);
    return 'Invalid Date';
  }
};

const formatTime = (dateString: string, timeZone: string): string => {
  if (!dateString || dateString === 'N/A' || !timeZone || timeZone === 'N/A') return 'N/A';
  try {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
      timeZone,
    });
  } catch (err) {
    console.error(`Failed to format time for ${timeZone}`, err);
    try {
       return new Date(dateString).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Invalid Time';
    }
  }
};

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex-1 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <h3 className="text-sm font-semibold text-cyan-400 mb-4 tracking-wider uppercase">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode; large?: boolean }> = ({ label, value, large = false }) => (
    <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className={large ? "text-2xl font-bold text-white" : "text-md text-slate-200"}>{value}</p>
    </div>
);

const TimeValue: React.FC<{ dateString: string; timeZone: string }> = ({ dateString, timeZone }) => {
  if (!dateString || dateString === 'N/A' || !timeZone || timeZone === 'N/A') {
    return <>N/A</>;
  }
  
  const datePart = formatDate(dateString, timeZone);
  const timePart = formatTime(dateString, timeZone);

  if (datePart === 'N/A' || datePart === 'Invalid Date') {
      return <>N/A</>;
  }

  return (
    <>
      {datePart}
      <span className="block text-sm text-slate-300">{timePart}</span>
    </>
  );
};

export const FlightDetails: React.FC<FlightDetailsProps> = ({ flightData }) => {
  const { departure, arrival, airline, flightNumber, status } = flightData;
  
  const statusColors: { [key: string]: string } = {
    'En Route': 'bg-blue-500/20 text-blue-300 border-blue-400',
    'Landed': 'bg-green-500/20 text-green-300 border-green-400',
    'Scheduled': 'bg-gray-500/20 text-gray-300 border-gray-400',
    'Delayed': 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
  };

  const statusColorClass = statusColors[status] || statusColors['Scheduled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <div>
            <p className="text-slate-400">{airline}</p>
            <p className="text-2xl font-bold text-white">{flightNumber}</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColorClass} mt-3 sm:mt-0`}>
            {status}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-6">
        {/* Departure */}
        <InfoCard title="Departure">
            <DetailRow label="Airport" value={<>{departure.airportName} <span className="text-slate-400">({departure.airportCode})</span></>} large />
            <DetailRow label="Location" value={`${departure.city}, ${departure.country}`} />
            <div className="grid grid-cols-2 gap-4 pt-2">
                <DetailRow label="Scheduled" value={<TimeValue dateString={departure.scheduledTime} timeZone={departure.timezone} />} />
                <DetailRow label="Actual/Est." value={<TimeValue dateString={departure.actualTime} timeZone={departure.timezone} />} />
                <DetailRow label="Terminal" value={departure.terminal} />
                <DetailRow label="Gate" value={departure.gate} />
            </div>
        </InfoCard>

        <div className="hidden md:flex items-center justify-center p-2">
            <ArrowRightIcon className="w-8 h-8 text-slate-600" />
        </div>

         {/* Arrival */}
        <InfoCard title="Arrival">
            <DetailRow label="Airport" value={<>{arrival.airportName} <span className="text-slate-400">({arrival.airportCode})</span></>} large />
            <DetailRow label="Location" value={`${arrival.city}, ${arrival.country}`} />
            <div className="grid grid-cols-2 gap-4 pt-2">
                <DetailRow label="Scheduled" value={<TimeValue dateString={arrival.scheduledTime} timeZone={arrival.timezone} />} />
                <DetailRow label="Actual/Est." value={<TimeValue dateString={arrival.actualTime} timeZone={arrival.timezone} />} />
                <DetailRow label="Terminal" value={arrival.terminal} />
                <DetailRow label="Gate" value={arrival.gate} />
            </div>
        </InfoCard>
      </div>
    </div>
  );
};
