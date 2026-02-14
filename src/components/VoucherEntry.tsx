import React, { useEffect, useState } from 'react';
import { useFocusManager } from '../hooks/useFocusManager';
import { useKeyHandler } from '../hooks/useKeyHandler';
import { DateInput } from './inputs/DateInput';
import { TallyInput } from './inputs/TallyInput';
import { CurrencyInput } from './inputs/CurrencyInput';
import { TallySelect } from './inputs/TallySelect';

interface VoucherEntryProps {
  type: string; // Payment, Receipt, etc.
  onBack: () => void;
}

export const VoucherEntry: React.FC<VoucherEntryProps> = ({ type, onBack }) => {
  const [currentType, setCurrentType] = useState(type);
  const fieldIds = ['date', 'ledger', 'amount', 'narration'];
  const { activeFieldId, focusNext, focusPrevious, setFocus } = useFocusManager(fieldIds);

  useKeyHandler((e) => {
    // Handle F-keys to switch voucher type
    if (e.key === 'F4') setCurrentType('Contra');
    else if (e.key === 'F5') setCurrentType('Payment');
    else if (e.key === 'F6') setCurrentType('Receipt');
    else if (e.key === 'F7') setCurrentType('Journal');
    else if (e.key === 'F8') setCurrentType('Sales');
    else if (e.key === 'F9') setCurrentType('Purchase');

    else if (e.key === 'Enter') {
      focusNext();
    } else if (e.key === 'Escape') {
      if (activeFieldId === fieldIds[0]) {
        onBack();
      } else {
        focusPrevious();
      }
    } else if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        console.log('Saved voucher:', currentType);
        onBack();
    }
  });

  // Set initial focus
  useEffect(() => {
      setTimeout(() => {
          document.getElementById('date')?.focus();
      }, 100);
  }, []);

  return (
    <div className="h-full flex flex-col" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="top-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#e0e0e0', borderBottom: '1px solid #ccc' }}>
        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Accounting Voucher Creation</h2>
        <div style={{ fontWeight: 'bold', color: 'blue', fontSize: '1.2em' }}>{currentType}</div>
      </div>

      <div className="form-content" style={{ padding: '20px', flex: 1, backgroundColor: '#f9f9f9' }}>
        <div className="row" style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
          <label style={{ width: '100px', fontWeight: 'bold' }}>Date:</label>
          <div style={{ width: '150px' }}>
             <DateInput
                id="date"
                onFocus={() => setFocus('date')}
             />
          </div>
        </div>

        <div className="row" style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
           <label style={{ width: '100px', fontWeight: 'bold' }}>Account:</label>
           <div style={{ width: '300px' }}>
             <TallySelect
                id="ledger"
                options={[
                    { label: 'Cash', value: 'cash' },
                    { label: 'HDFC Bank', value: 'hdfc' },
                    { label: 'SBI Bank', value: 'sbi' },
                ]}
                onFocus={() => setFocus('ledger')}
             />
           </div>
           <div style={{ flex: 1, textAlign: 'right', paddingRight: '20px' }}>
               Current Balance: 0.00 Dr
           </div>
        </div>

        <div className="ledger-details" style={{ border: '1px solid #ccc', minHeight: '300px', marginTop: '20px', padding: '10px', backgroundColor: 'white' }}>
            <div className="row" style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' }}>
                <div style={{ flex: 1, fontWeight: 'bold' }}>Particulars</div>
                <div style={{ width: '150px', textAlign: 'right', fontWeight: 'bold' }}>Amount</div>
            </div>

            <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                     <TallyInput
                        placeholder="Particulars"
                        readOnly
                        value="By: Rent A/c"
                        style={{ border: 'none', background: 'transparent' }}
                     />
                </div>
                <div style={{ width: '150px' }}>
                    <CurrencyInput
                        id="amount"
                        onFocus={() => setFocus('amount')}
                    />
                </div>
            </div>
        </div>

        <div className="row" style={{ display: 'flex', marginTop: '10px', alignItems: 'center' }}>
            <label style={{ width: '100px', fontWeight: 'bold' }}>Narration:</label>
            <div style={{ flex: 1 }}>
                <TallyInput
                    id="narration"
                    onFocus={() => setFocus('narration')}
                    style={{ fontStyle: 'italic' }}
                />
            </div>
        </div>
      </div>
    </div>
  );
};
