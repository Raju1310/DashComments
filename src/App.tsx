import React, { useEffect, useState } from 'react';
import { Shell } from './components/Shell';
import { Gateway } from './components/Gateway';
import { VoucherEntry } from './components/VoucherEntry';
import { GroupList } from './components/masters/GroupList';
import { LedgerList } from './components/masters/LedgerList';
import { TrialBalance } from './components/reports/TrialBalance';
import { DayBook } from './components/reports/DayBook';
import { LedgerStatement } from './components/reports/LedgerStatement';
import { useNavigationStack } from './hooks/useNavigationStack';
import { initDb } from './db/db';
import type { ScreenName } from './types';
import './App.css';

const App: React.FC = () => {
  const { currentScreen, push, pop } = useNavigationStack();
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDb().then(() => {
      setDbReady(true);
    }).catch(e => {
      console.error(e);
      setError("Failed to load database. Please check console.");
    });
  }, []);

  const handleNavigate = (screen: ScreenName, props?: any) => {
    push(screen, props);
  };

  const handleBack = () => {
    pop();
  };

  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'GATEWAY':
        return <Gateway onNavigate={handleNavigate} />;
      case 'VOUCHER_ENTRY':
        return <VoucherEntry type={currentScreen.props?.type || 'Payment'} onBack={handleBack} />;
      case 'GROUP_LIST':
        return <GroupList />; // Simple wrapper, maybe adding "onSelect" later
      case 'LEDGER_LIST':
        return <LedgerList />;
      case 'TRIAL_BALANCE':
        return <TrialBalance onDrillDown={(id) => push('LEDGER_STATEMENT', { ledgerId: id })} />;
      case 'DAY_BOOK':
        return <DayBook onDrillDown={(id) => console.log('Drill to voucher', id)} />;
      case 'LEDGER_STATEMENT':
        return <LedgerStatement ledgerId={currentScreen.props?.ledgerId} />;
      case 'BALANCE_SHEET':
        return <div>Balance Sheet (Coming Soon)</div>;
      case 'PROFIT_LOSS':
        return <div>Profit & Loss (Coming Soon)</div>;
      default:
        return <div>Unknown Screen</div>;
    }
  };

  if (error) {
      return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }

  if (!dbReady) {
      return <div className="flex items-center justify-center h-full">Loading Database...</div>;
  }

  return (
    <Shell currentScreenName={currentScreen.name}>
      {renderScreen()}
    </Shell>
  );
};

export default App;
