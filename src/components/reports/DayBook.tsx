import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import type { DayBookEntry } from '../../services/reportService';
import { useKeyHandler } from '../../hooks/useKeyHandler';

interface DayBookProps {
  onDrillDown: (voucherId: string) => void;
}

export const DayBook: React.FC<DayBookProps> = ({ onDrillDown }) => {
  const [data, setData] = useState<DayBookEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setData(reportService.getDayBook());
  }, []);

  useKeyHandler((e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % data.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + data.length) % data.length);
    } else if (e.key === 'Enter') {
      if (data[selectedIndex]) {
        onDrillDown(data[selectedIndex].id);
      }
    }
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-gray-200 p-2 font-bold border-b border-gray-400 text-center">
        Day Book
      </div>

      <div className="flex bg-gray-100 font-bold border-b border-gray-300 py-1 text-sm">
          <div className="w-24 px-2">Date</div>
          <div className="flex-1 px-2">Particulars</div>
          <div className="w-24 px-2">Vch Type</div>
          <div className="w-20 px-2">Vch No</div>
          <div className="w-32 text-right px-2">Debit Amount</div>
          <div className="w-32 text-right px-2">Credit Amount</div>
      </div>

      <div className="flex-1 overflow-auto">
          {data.map((row, index) => (
            <div
                key={row.id}
                className={`flex py-1 cursor-pointer text-sm ${index === selectedIndex ? 'bg-blue-800 text-white' : ''}`}
            >
                <div className="w-24 px-2">{row.date}</div>
                <div className="flex-1 px-2">{row.ledgerName}</div>
                <div className="w-24 px-2">{row.voucherType}</div>
                <div className="w-20 px-2">{row.voucherNumber}</div>
                <div className="w-32 text-right px-2">{row.amount?.toFixed(2)}</div>
                <div className="w-32 text-right px-2"></div>
            </div>
          ))}
      </div>
    </div>
  );
};
