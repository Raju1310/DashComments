import React from 'react';
import { Shell } from './components/Shell';
import { Gateway } from './components/Gateway';
import { VoucherEntry } from './components/VoucherEntry';
import { useNavigationStack } from './hooks/useNavigationStack';
import './App.css';

const App: React.FC = () => {
  const { currentScreen, push, pop } = useNavigationStack();

  const handleNavigate = (screen: any, props?: any) => {
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
      default:
        return <div>Unknown Screen</div>;
    }
  };

  return (
    <Shell currentScreenName={currentScreen.name}>
      {renderScreen()}
    </Shell>
  );
};

export default App;
