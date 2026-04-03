import React, { useEffect, useState } from 'react';
import { useFocusManager } from '../hooks/useFocusManager';
import { useKeyHandler } from '../hooks/useKeyHandler';
import { DateInput } from './inputs/DateInput';
import { TallyInput } from './inputs/TallyInput';
import { CurrencyInput } from './inputs/CurrencyInput';
import { TallySelect } from './inputs/TallySelect';
import { masterService } from '../services/masterService';
import type { Ledger } from '../services/masterService';
import { transactionService } from '../services/transactionService';

interface VoucherEntryProps {
  type: string;
  onBack: () => void;
}

interface EntryRow {
  id: string; // internal id for list
  type: 'Dr' | 'Cr';
  ledgerId: string;
  amount: number;
}

export const VoucherEntry: React.FC<VoucherEntryProps> = ({ type, onBack }) => {
  const [currentType, setCurrentType] = useState(type);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [narration, setNarration] = useState('');

  const [rows, setRows] = useState<EntryRow[]>([
    { id: '1', type: 'Dr', ledgerId: '', amount: 0 },
    { id: '2', type: 'Cr', ledgerId: '', amount: 0 }
  ]);

  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Dynamically generate field IDs based on rows
  const getFieldIds = () => {
      const ids: string[] = ['date'];
      rows.forEach((row, index) => {
          ids.push(`type_${index}`);
          ids.push(`ledger_${index}`);
          ids.push(`amount_${index}`);
      });
      ids.push('narration');
      return ids;
  };

  const { activeFieldId, focusNext, focusPrevious, setFocus, setFieldIds } = useFocusManager(getFieldIds());

  useEffect(() => {
    setLedgers(masterService.getLedgers());
    setFieldIds(getFieldIds());
    setTimeout(() => document.getElementById('date')?.focus(), 100);
  }, []);

  useEffect(() => {
      setFieldIds(getFieldIds());
  }, [rows]);

  const handleSave = () => {
      try {
          transactionService.createVoucher({
              type: currentType,
              date,
              narration,
              // Convert amount to paisa (x100) before sending to service
              entries: rows.map(r => ({ ledgerId: r.ledgerId, amount: Math.round(r.amount * 100), type: r.type }))
          });
          setStatusMessage('Voucher Saved Successfully');
          // Reset
          setRows([
            { id: Date.now() + '1', type: 'Dr', ledgerId: '', amount: 0 },
            { id: Date.now() + '2', type: 'Cr', ledgerId: '', amount: 0 }
          ]);
          setNarration('');
          setDate(new Date().toISOString().split('T')[0]);
          setTimeout(() => {
              setStatusMessage('');
              setFocus('date');
          }, 2000);
      } catch (e: any) {
          setStatusMessage(`Error: ${e.message}`);
      }
  };

  useKeyHandler((e) => {
    if (e.key === 'F4') setCurrentType('Contra');
    else if (e.key === 'F5') setCurrentType('Payment');
    else if (e.key === 'F6') setCurrentType('Receipt');
    else if (e.key === 'F7') setCurrentType('Journal');
    else if (e.key === 'F8') setCurrentType('Sales');
    else if (e.key === 'F9') setCurrentType('Purchase');

    else if (e.key === 'Enter') {
      // Prevent VoucherEntry handling if we are inside a modal (which we track via focus or another mechanism?)
      // But TallySelect handles keydown via its own onKeyDown handler which stops propagation if it handles it.
      // But useKeyHandler is a global window listener. It fires BEFORE React's synthetic events bubble up?
      // Actually window listener fires first in capturing or last in bubbling?
      // Our useKeyHandler uses default bubbling. React attaches to root.
      // So useKeyHandler (window) fires AFTER React event handlers? No, window listeners fire independent of React tree.

      // If TallySelect (React) handles Alt+C, it calls e.preventDefault().
      // Does that stop our window listener?
      // No.

      // We need to check if defaultPrevented?
      // Since useKeyHandler is global, e.defaultPrevented might be true if TallySelect called preventDefault.
      if (e.defaultPrevented) return;

      e.preventDefault(); // Prevent form submission now that we handled it

      // If modal is active? VoucherEntry doesn't know about modal state inside TallySelect.
      // But TallySelect modal is a portal or just absolute div? It's inside TallySelect.
      // If modal is open, TallySelect should capture keys.

      // Let's assume if we are here, TallySelect didn't handle it or we are bubbling.

      // If modal is active? VoucherEntry doesn't know about modal state inside TallySelect.
      // But TallySelect modal is a portal or just absolute div? It's inside TallySelect.
      // If modal is open, TallySelect should capture keys.

      // Let's assume if we are here, TallySelect didn't handle it or we are bubbling.

      const isLastAmount = rows.length > 0 && activeFieldId === `amount_${rows.length - 1}`;

      if (isLastAmount) {
           const totalDr = rows.filter(r => r.type === 'Dr').reduce((sum, r) => sum + r.amount, 0);
           const totalCr = rows.filter(r => r.type === 'Cr').reduce((sum, r) => sum + r.amount, 0);

           if (totalDr !== totalCr) {
               // Add new row if not balanced
               const newType = totalDr > totalCr ? 'Cr' : 'Dr';
               const diff = Math.abs(totalDr - totalCr);

               setRows(prev => [...prev, { id: Date.now().toString(), type: newType, ledgerId: '', amount: diff }]);

               // Focus new row manually after a tick
               setTimeout(() => {
                   document.getElementById(`ledger_${rows.length}`)?.focus();
                   setFocus(`ledger_${rows.length}`);
               }, 50);
               return;
           } else {
               // Balanced, move to narration
               setFocus('narration');
               return;
           }
      } else if (activeFieldId === 'narration') {
          handleSave();
          return;
      }

      focusNext();

    } else if (e.key === 'Escape') {
      if (activeFieldId === 'date') {
        onBack();
      } else {
        focusPrevious();
      }
    } else if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        handleSave();
    }
  });

  // Render check
  console.log("VoucherEntry Render. Rows:", rows.length);

  const updateRow = (index: number, field: keyof EntryRow, value: any) => {
      const newRows = [...rows];
      newRows[index] = { ...newRows[index], [field]: value };
      setRows(newRows);
  };

  const refreshLedgers = () => {
      setLedgers(masterService.getLedgers());
  };

  return (
    <div className="h-full flex flex-col">
      <div className="top-header flex justify-between p-2 bg-gray-200 border-b border-gray-400">
        <h2 className="font-bold uppercase">Accounting Voucher Creation</h2>
        <div className="font-bold text-blue-800 text-xl">{currentType}</div>
      </div>

      {statusMessage && (
          <div className={`p-2 text-white font-bold text-center ${statusMessage.startsWith('Error') ? 'bg-red-500' : 'bg-green-600'}`}>
              {statusMessage}
          </div>
      )}

      <div className="form-content p-4 flex-1 bg-gray-50 overflow-auto relative">
        <div className="row flex mb-2 items-center">
          <label className="w-24 font-bold">Date:</label>
          <div className="w-32">
             <DateInput
                id="date"
                value={date}
                onChange={setDate}
                onFocus={() => setFocus('date')}
             />
          </div>
        </div>

        <div className="border border-gray-400 bg-white min-h-[300px] mt-4 p-2">
            <div className="flex border-b border-gray-200 pb-1 mb-2 font-bold text-sm">
                <div className="w-10">Dr/Cr</div>
                <div className="flex-1 ml-2">Particulars</div>
                <div className="w-32 text-right">Debit</div>
                <div className="w-32 text-right">Credit</div>
            </div>

            {rows.map((row, index) => (
                <div key={row.id} className="flex items-center mb-1">
                    <div className="w-10">
                        <TallyInput
                            id={`type_${index}`}
                            value={row.type}
                            onChange={(e) => updateRow(index, 'type', e.target.value as 'Dr'|'Cr')}
                            onFocus={() => setFocus(`type_${index}`)}
                        />
                    </div>
                    <div className="flex-1 mx-2 relative">
                        <TallySelect
                            id={`ledger_${index}`}
                            options={ledgers.map(l => ({ label: l.name, value: l.id }))}
                            value={row.ledgerId}
                            onChange={(val) => updateRow(index, 'ledgerId', val)}
                            onFocus={() => setFocus(`ledger_${index}`)}
                            allowCreate={true}
                            onCreateSuccess={(newId) => {
                                const updatedLedgers = masterService.getLedgers();
                                setLedgers(updatedLedgers);
                                updateRow(index, 'ledgerId', newId);
                            }}
                        />
                        <div className="text-xs text-gray-500 text-right absolute right-0 top-full bg-white z-10 px-1 border border-gray-200">
                             {/* Display Balance (divided by 100) */}
                             {((ledgers.find(l => l.id === row.ledgerId)?.current_balance || 0) / 100).toFixed(2)} Dr
                        </div>
                    </div>
                    <div className="w-32 mx-1">
                        {row.type === 'Dr' ? (
                            <CurrencyInput
                                id={`amount_${index}`}
                                value={row.amount}
                                onChange={(val) => updateRow(index, 'amount', val)}
                                onFocus={() => setFocus(`amount_${index}`)}
                            />
                        ) : <div className="w-full h-full bg-gray-100 border border-gray-200" />}
                    </div>
                    <div className="w-32">
                        {row.type === 'Cr' ? (
                            <CurrencyInput
                                id={`amount_${index}`}
                                value={row.amount}
                                onChange={(val) => updateRow(index, 'amount', val)}
                                onFocus={() => setFocus(`amount_${index}`)}
                            />
                        ) : <div className="w-full h-full bg-gray-100 border border-gray-200" />}
                    </div>
                </div>
            ))}
        </div>

        <div className="row flex mt-4 items-center">
            <label className="w-24 font-bold">Narration:</label>
            <div className="flex-1">
                <TallyInput
                    id="narration"
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    onFocus={() => setFocus('narration')}
                    style={{ fontStyle: 'italic' }}
                />
            </div>
        </div>
      </div>
    </div>
  );
};
