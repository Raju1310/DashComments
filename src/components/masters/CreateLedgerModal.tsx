import React, { useState, useEffect } from 'react';
import { masterService } from '../../services/masterService';
import type { Group } from '../../services/masterService';
import { TallyInput } from '../inputs/TallyInput';
import { TallySelect } from '../inputs/TallySelect';
import { CurrencyInput } from '../inputs/CurrencyInput';
import { useFocusManager } from '../../hooks/useFocusManager';
import { useKeyHandler } from '../../hooks/useKeyHandler';

interface CreateLedgerModalProps {
  onSave: (id: string) => void;
  onCancel: () => void;
}

export const CreateLedgerModal: React.FC<CreateLedgerModalProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [openingBalance, setOpeningBalance] = useState(0);
  const [groups, setGroups] = useState<Group[]>([]);

  const fieldIds = ['l_name', 'l_group', 'l_ob'];
  const { focusNext, focusPrevious, setFocus } = useFocusManager(fieldIds);

  useEffect(() => {
    setGroups(masterService.getGroups());
    setTimeout(() => document.getElementById('l_name')?.focus(), 100);
  }, []);

  useKeyHandler((e) => {
    // If modal is open, we stop other handlers from firing
    e.stopImmediatePropagation();
    e.stopPropagation();

    if (e.key === 'Enter') {
      focusNext();
    } else if (e.key === 'Escape') {
      onCancel();
    } else if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      handleSave();
    }
  });

  const handleSave = () => {
    if (!name || !groupId) return;
    const newId = masterService.createLedger(name, groupId, openingBalance);
    onSave(newId);
  };

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: 'white', border: '2px solid #002b36', padding: '20px', zIndex: 1000,
      width: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }}>
      <h3 style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>Ledger Creation</h3>

      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <label className="w-24">Name:</label>
          <TallyInput
            id="l_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocus('l_name')}
          />
        </div>

        <div className="flex items-center">
          <label className="w-24">Under:</label>
          <TallySelect
            id="l_group"
            options={groups.map(g => ({ label: g.name, value: g.id }))}
            value={groupId}
            onChange={(val) => setGroupId(val)}
            onFocus={() => setFocus('l_group')}
          />
        </div>

        <div className="flex items-center">
          <label className="w-24">Op Bal:</label>
          <CurrencyInput
            id="l_ob"
            value={openingBalance}
            onChange={(val) => setOpeningBalance(val)}
            onFocus={() => setFocus('l_ob')}
          />
        </div>
      </div>

      <div className="mt-4 text-xs text-right text-gray-500">Ctrl+A to Save, Esc to Quit</div>
    </div>
  );
};
