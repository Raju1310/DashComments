import React, { useState, useEffect, forwardRef, FocusEvent, ChangeEvent } from 'react';
import { TallyInput } from './TallyInput';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number | string;
  onChange?: (value: number) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, onBlur, onFocus, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    const formatCurrency = (val: number) => {
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    useEffect(() => {
      if (value !== undefined && value !== null && value !== '') {
        setDisplayValue(formatCurrency(Number(value)));
      } else {
        setDisplayValue('');
      }
    }, [value]);

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/,/g, '');
      const numValue = parseFloat(rawValue);
      if (!isNaN(numValue)) {
        setDisplayValue(formatCurrency(numValue));
        onChange?.(numValue);
      } else {
        // preserve current display value if invalid? or clear?
        // usually tally keeps what you typed if invalid or reverts.
        // let's try to parse if possible
      }
      onBlur?.(e);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      e.target.select();
      onFocus?.(e);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDisplayValue(e.target.value);
    };

    return (
      <TallyInput
        ref={ref}
        type="text"
        textAlign="right"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        {...props}
      />
    );
  }
);
