import React, { useState, useEffect } from 'react';
import { masterService } from '../../services/masterService';
import type { Ledger } from '../../services/masterService';
import { useKeyHandler } from '../../hooks/useKeyHandler';
import { CreateLedgerModal } from './CreateLedgerModal';

export const LedgerList: React.FC = () => {
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadLedgers();
  }, []);

  const loadLedgers = () => {
    setLedgers(masterService.getLedgers());
  };

  useKeyHandler((e) => {
    if (showModal) return;

    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % ledgers.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + ledgers.length) % ledgers.length);
    } else if (e.altKey && e.key.toLowerCase() === 'c') {
      setShowModal(true);
    }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-200 p-2 font-bold border-b border-gray-400 flex justify-between">
        <span>List of Ledgers</span>
        <span className="text-sm">Alt+C: Create</span>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {ledgers.map((ledger, index) => (
          <div
            key={ledger.id}
            className={`px-2 py-1 flex justify-between cursor-pointer`}
            style={{
              backgroundColor: index === selectedIndex ? '#002b36' : 'white',
              color: index === selectedIndex ? 'white' : 'black'
            }}
          >
            <span>{ledger.name}</span>
            <span>{(ledger.current_balance / 100).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <CreateLedgerModal
          onSave={(id) => { setShowModal(false); loadLedgers(); }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
