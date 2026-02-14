import React, { useState, useEffect, forwardRef } from 'react';
import { TallyInput } from './TallyInput';

interface Option {
  label: string;
  value: string;
}

interface TallySelectProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
}

export const TallySelect = forwardRef<HTMLInputElement, TallySelectProps>(
  ({ options, value, onChange, onBlur, onKeyDown, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [filter, setFilter] = useState('');

    const selectedLabel = options.find(o => o.value === value)?.label || '';
    const [inputValue, setInputValue] = useState(selectedLabel);

    useEffect(() => {
        setInputValue(selectedLabel);
    }, [selectedLabel]);

    const filteredOptions = options.filter(o =>
      o.label.toLowerCase().includes(filter.toLowerCase())
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                e.preventDefault();
                setIsOpen(true);
                setFilter('');
                setHighlightedIndex(0);
            }
        } else {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex(prev => (prev + 1) % filteredOptions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                if (filteredOptions[highlightedIndex]) {
                    handleSelect(filteredOptions[highlightedIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
                setInputValue(selectedLabel);
            }
        }
        onKeyDown?.(e);
    };

    const handleSelect = (option: Option) => {
        onChange?.(option.value);
        setInputValue(option.label);
        setIsOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setFilter(e.target.value);
        setIsOpen(true);
        setHighlightedIndex(0);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
            setIsOpen(false);
            if (!options.find(o => o.label === inputValue) && inputValue !== '') {
                 // Check if input matches any option
                 const match = options.find(o => o.label.toLowerCase() === inputValue.toLowerCase());
                 if (match) {
                     handleSelect(match);
                 } else {
                     setInputValue(selectedLabel);
                 }
            }
        }, 200);
        onBlur?.(e);
    };

    return (
        <div style={{ position: 'relative' }}>
            <TallyInput
                ref={ref}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                autoComplete="off"
                {...props}
            />
            {isOpen && filteredOptions.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    backgroundColor: 'white',
                    border: '1px solid black',
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {filteredOptions.map((option, index) => (
                        <li
                            key={option.value}
                            style={{
                                padding: '4px',
                                backgroundColor: index === highlightedIndex ? '#000080' : 'transparent',
                                color: index === highlightedIndex ? 'white' : 'black',
                                cursor: 'pointer'
                            }}
                            onMouseDown={() => handleSelect(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
  }
);
