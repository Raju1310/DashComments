import React, { useState, useEffect, forwardRef, FocusEvent } from 'react';
import { TallyInput } from './TallyInput';
import { parse, format, isValid } from 'date-fns';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange?: (value: string) => void;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
      if (value) {
        const date = new Date(value);
        if (isValid(date)) {
          setDisplayValue(format(date, 'dd-MMM-yyyy'));
        }
      }
    }, [value]);

    const parseDate = (input: string) => {
      const currentYear = new Date().getFullYear();
      let parsedDate: Date | null = null;
      const normalized = input.replace(/\./g, '-').replace(/\//g, '-');

      const parts = normalized.split('-');

      if (parts.length === 2) {
          // d-M -> current year
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          if (!isNaN(d) && !isNaN(m)) {
              parsedDate = new Date(currentYear, m - 1, d);
          }
      } else {
          // Try standard formats
          const formats = ['d-M-yyyy', 'd-M-yy', 'yyyy-MM-dd'];
          for (const fmt of formats) {
              const d = parse(normalized, fmt, new Date());
              if (isValid(d)) {
                  parsedDate = d;
                  break;
              }
          }
      }

      return parsedDate;
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val) {
          const date = parseDate(val);
          if (date && isValid(date)) {
              const iso = format(date, 'yyyy-MM-dd');
              setDisplayValue(format(date, 'dd-MMM-yyyy'));
              onChange?.(iso);
          }
      }
      onBlur?.(e);
    };

    return (
      <TallyInput
        ref={ref}
        value={displayValue}
        onChange={(e) => setDisplayValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="DD-MM-YYYY"
        {...props}
      />
    );
  }
);
