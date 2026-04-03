import React from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

interface ShellProps {
  children: React.ReactNode;
  currentScreenName: string;
}

export const Shell: React.FC<ShellProps> = ({ children, currentScreenName }) => {
  return (
    <div className="shell-container">
      <div className="main-content">
        <TopBar />
        <div className="content-area flex-1" style={{ padding: '8px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
      <Sidebar currentScreenName={currentScreenName} />
    </div>
  );
};
