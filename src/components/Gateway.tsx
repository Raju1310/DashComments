import React, { useState } from 'react';
import { useKeyHandler } from '../hooks/useKeyHandler';

interface GatewayProps {
  onNavigate: (screen: any, props?: any) => void;
}

const MENU_ITEMS = [
  { label: 'Masters', action: 'MASTERS', disabled: true },
  { label: 'Transactions', action: 'TRANSACTIONS', shortcut: 't' }, // Maps to Voucher Entry for now
  { label: 'Utilities', action: 'UTILITIES', disabled: true },
  { label: 'Reports', action: 'REPORTS', disabled: true },
  { label: 'Quit', action: 'QUIT', shortcut: 'q', disabled: true },
];

export const Gateway: React.FC<GatewayProps> = ({ onNavigate }) => {
  const [selectedIndex, setSelectedIndex] = useState(1); // Default to Transactions

  useKeyHandler((e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => (prev + 1) % MENU_ITEMS.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
    } else if (e.key === 'Enter') {
      handleSelect(MENU_ITEMS[selectedIndex]);
    } else if (e.key.toLowerCase() === 'v') {
        onNavigate('VOUCHER_ENTRY', { type: 'Payment' });
    }
  });

  const handleSelect = (item: typeof MENU_ITEMS[0]) => {
      if (item.label === 'Transactions') {
          onNavigate('VOUCHER_ENTRY', { type: 'Payment' });
      }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ border: '2px solid #002b36', width: '400px', backgroundColor: 'white', display: 'flex' }}>
        <div style={{ width: '50%', padding: '10px', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc', fontSize: '12px' }}>
            <p>Current Period</p>
            <p className="font-bold">Apr 2024 - Mar 2025</p>
            <br/>
            <p>Current Date</p>
            <p className="font-bold">01-Apr-2024</p>
        </div>
        <div style={{ width: '50%' }}>
             <div style={{ backgroundColor: '#002b36', color: 'white', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                Gateway of Tally
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {MENU_ITEMS.map((item, index) => (
                <li
                key={item.label}
                className={`nav-item ${index === selectedIndex ? 'active' : ''}`}
                style={{ padding: '4px 8px', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => handleSelect(item)}
                >
                {item.label}
                </li>
            ))}
            </ul>
        </div>
      </div>
    </div>
  );
};
