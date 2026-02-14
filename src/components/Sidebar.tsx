import React from 'react';

interface SidebarProps {
  currentScreenName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreenName }) => {
  const getShortcuts = () => {
    switch (currentScreenName) {
      case 'VOUCHER_ENTRY':
        return [
          { key: 'F4', label: 'Contra' },
          { key: 'F5', label: 'Payment' },
          { key: 'F6', label: 'Receipt' },
          { key: 'F7', label: 'Journal' },
          { key: 'F8', label: 'Sales' },
          { key: 'F9', label: 'Purchase' },
        ];
      case 'GATEWAY':
      default:
        return [
          { key: 'F1', label: 'Select Cmp' },
          { key: 'F2', label: 'Date' },
          { key: 'F3', label: 'Company' },
          { key: 'F11', label: 'Features' },
          { key: 'F12', label: 'Config' },
        ];
    }
  };

  const shortcuts = getShortcuts();

  return (
    <div className="sidebar">
      {shortcuts.map((s) => (
        <button key={s.key} className="sidebar-btn">
          <span style={{ fontWeight: 'bold' }}>{s.key}</span>: {s.label}
        </button>
      ))}
    </div>
  );
};
