import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <div className="flex-1">OpenLedger Demo Company</div>
      <div className="flex-1 text-center">Session: 01-Apr-2024 to 31-Mar-2025</div>
      <div className="flex-1 text-right text-sm">
        F1: Help | F2: Date | F3: Company
      </div>
    </div>
  );
};
