import React, { useState, useEffect } from 'react';
import { masterService } from '../../services/masterService';
import type { Group } from '../../services/masterService';
import { TallyInput } from '../inputs/TallyInput';
import { TallySelect } from '../inputs/TallySelect';
import { useFocusManager } from '../../hooks/useFocusManager';
import { useKeyHandler } from '../../hooks/useKeyHandler';

interface CreateGroupModalProps {
  onSave: () => void;
  onCancel: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [nature, setNature] = useState('Asset');
  const [groups, setGroups] = useState<Group[]>([]);

  const fieldIds = ['name', 'parent', 'nature'];
  const { focusNext, focusPrevious, setFocus } = useFocusManager(fieldIds);

  useEffect(() => {
    setGroups(masterService.getGroups());
    setTimeout(() => document.getElementById('name')?.focus(), 100);
  }, []);

  useKeyHandler((e) => {
    // Only handle keys if this modal is "active"
    // Since useKeyHandler is global, we need to ensure we don't conflict.
    // However, if this modal is mounted, it should take precedence or we should stop propagation?
    // The useKeyHandler implementation adds listener to window.
    // If multiple components use it, all fire.
    // We should probably rely on focus management or a stack of handlers, but for now:
    e.stopPropagation(); // Try to stop others? React event vs Native event issues.

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
    if (!name || !parentId) return; // Validation
    masterService.createGroup(name, parentId, nature);
    onSave();
  };

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: 'white', border: '2px solid #002b36', padding: '20px', zIndex: 1000,
      width: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }}>
      <h3 style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>Group Creation</h3>

      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <label className="w-24">Name:</label>
          <TallyInput
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocus('name')}
          />
        </div>

        <div className="flex items-center">
          <label className="w-24">Under:</label>
          <TallySelect
            id="parent"
            options={groups.map(g => ({ label: g.name, value: g.id }))}
            value={parentId}
            onChange={(val) => setParentId(val)}
            onFocus={() => setFocus('parent')}
          />
        </div>

        <div className="flex items-center">
          <label className="w-24">Nature:</label>
          <TallySelect
            id="nature"
            options={['Asset', 'Liability', 'Income', 'Expense'].map(n => ({ label: n, value: n }))}
            value={nature}
            onChange={(val) => setNature(val)}
            onFocus={() => setFocus('nature')}
          />
        </div>
      </div>

      <div className="mt-4 text-xs text-right text-gray-500">Ctrl+A to Save, Esc to Quit</div>
    </div>
  );
};
