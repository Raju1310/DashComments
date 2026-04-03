import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import type { LedgerStatementEntry } from '../../services/reportService';
import { useKeyHandler } from '../../hooks/useKeyHandler';

interface LedgerStatementProps {
  ledgerId: string;
}

export const LedgerStatement: React.FC<LedgerStatementProps> = ({ ledgerId }) => {
  const [data, setData] = useState<LedgerStatementEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setData(reportService.getLedgerStatement(ledgerId));
  }, [ledgerId]);

  useKeyHandler((e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % data.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + data.length) % data.length);
    }
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-gray-200 p-2 font-bold border-b border-gray-400 text-center">
        Ledger Statement
      </div>

      <div className="flex bg-gray-100 font-bold border-b border-gray-300 py-1 text-sm">
          <div className="w-24 px-2">Date</div>
          <div className="flex-1 px-2">Particulars</div>
          <div className="w-24 px-2">Vch Type</div>
          <div className="w-20 px-2">Vch No</div>
          <div className="w-24 text-right px-2">Debit</div>
          <div className="w-24 text-right px-2">Credit</div>
          <div className="w-24 text-right px-2">Balance</div>
      </div>

      <div className="flex-1 overflow-auto">
          {data.map((row, index) => (
            <div
                key={index}
                className={`flex py-1 cursor-pointer text-sm ${index === selectedIndex ? 'bg-blue-800 text-white' : ''}`}
            >
                <div className="w-24 px-2">{row.date}</div>
                <div className="flex-1 px-2">{row.particulars}</div>
                <div className="w-24 px-2">{row.voucherType}</div>
                <div className="w-20 px-2">{row.voucherNumber}</div>
                <div className="w-24 text-right px-2">{row.debit?.toFixed(2)}</div>
                <div className="w-24 text-right px-2">{row.credit?.toFixed(2)}</div>
                <div className="w-24 text-right px-2">{row.balance.toFixed(2)}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
