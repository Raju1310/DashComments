import React, { useState, useEffect } from 'react';
import { masterService } from '../../services/masterService';
import type { Group } from '../../services/masterService';
import { useKeyHandler } from '../../hooks/useKeyHandler';
import { CreateGroupModal } from './CreateGroupModal';

export const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = () => {
    setGroups(masterService.getGroups());
  };

  useKeyHandler((e) => {
    if (showModal) return;

    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % groups.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + groups.length) % groups.length);
    } else if (e.altKey && e.key.toLowerCase() === 'c') {
      setShowModal(true);
    }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-200 p-2 font-bold border-b border-gray-400 flex justify-between">
        <span>List of Accounts (Groups)</span>
        <span className="text-sm">Alt+C: Create</span>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {groups.map((group, index) => (
          <div
            key={group.id}
            className={`px-2 py-1 cursor-pointer ${index === selectedIndex ? 'bg-blue-800 text-white' : ''}`}
            style={{
              paddingLeft: `${(group.path.split('/').length - 1) * 20}px`,
              backgroundColor: index === selectedIndex ? '#002b36' : 'white',
              color: index === selectedIndex ? 'white' : 'black'
            }}
          >
            {group.name}
          </div>
        ))}
      </div>

      {showModal && (
        <CreateGroupModal
          onSave={() => { setShowModal(false); loadGroups(); }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
