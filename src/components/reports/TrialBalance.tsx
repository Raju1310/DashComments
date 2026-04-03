import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import type { TrialBalanceEntry } from '../../services/reportService';
import { useKeyHandler } from '../../hooks/useKeyHandler';

export const TrialBalance: React.FC<{ onDrillDown: (id: string) => void }> = ({ onDrillDown }) => {
  const [data, setData] = useState<TrialBalanceEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setData(reportService.getTrialBalance());
  }, []);

  useKeyHandler((e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % data.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + data.length) % data.length);
    } else if (e.key === 'Enter') {
      if (data[selectedIndex]) {
        onDrillDown(data[selectedIndex].ledgerId);
      }
    }
  });

  const totalDr = data.reduce((sum, row) => {
      // If balance is Dr, add to Dr total
      // Asset/Expense +ve = Dr
      // Liab/Income -ve = Dr
      let drAmount = 0;
      if (row.nature === 'Asset' || row.nature === 'Expense') {
          if (row.balance > 0) drAmount = row.balance;
      } else {
          if (row.balance < 0) drAmount = Math.abs(row.balance);
      }
      return sum + drAmount;
  }, 0);

  const totalCr = data.reduce((sum, row) => {
      let crAmount = 0;
      if (row.nature === 'Asset' || row.nature === 'Expense') {
          if (row.balance < 0) crAmount = Math.abs(row.balance);
      } else {
          if (row.balance > 0) crAmount = row.balance;
      }
      return sum + crAmount;
  }, 0);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-gray-200 p-2 font-bold border-b border-gray-400 text-center">
        Trial Balance
      </div>

      <div className="flex bg-gray-100 font-bold border-b border-gray-300 py-1 text-sm">
          <div className="flex-1 px-2">Particulars</div>
          <div className="w-32 text-right px-2">Debit</div>
          <div className="w-32 text-right px-2">Credit</div>
      </div>

      <div className="flex-1 overflow-auto">
          {data.map((row, index) => {
              let isDr = false;
              let absBal = Math.abs(row.balance);
              if (row.nature === 'Asset' || row.nature === 'Expense') {
                  isDr = row.balance > 0;
              } else {
                  isDr = row.balance < 0;
              }

              return (
                <div
                    key={row.ledgerId}
                    className={`flex py-1 cursor-pointer text-sm ${index === selectedIndex ? 'bg-blue-800 text-white' : ''}`}
                >
                    <div className="flex-1 px-2">{row.ledgerName}</div>
                    <div className="w-32 text-right px-2">
                        {isDr ? absBal.toFixed(2) : ''}
                    </div>
                    <div className="w-32 text-right px-2">
                        {!isDr ? absBal.toFixed(2) : ''}
                    </div>
                </div>
              );
          })}
      </div>

      <div className="flex bg-gray-200 font-bold border-t border-gray-400 py-1 text-sm">
          <div className="flex-1 px-2 text-right">Total</div>
          <div className="w-32 text-right px-2">{totalDr.toFixed(2)}</div>
          <div className="w-32 text-right px-2">{totalCr.toFixed(2)}</div>
      </div>
    </div>
  );
};
