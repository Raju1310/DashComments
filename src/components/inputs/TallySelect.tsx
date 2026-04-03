import React, { useState, useEffect, forwardRef } from 'react';
import { TallyInput } from './TallyInput';
import { CreateLedgerModal } from '../masters/CreateLedgerModal';

interface Option {
  label: string;
  value: string;
}

interface TallySelectProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  allowCreate?: boolean;
  onCreateSuccess?: (newId: string) => void;
}

export const TallySelect = forwardRef<HTMLInputElement, TallySelectProps>(
  ({ options, value, onChange, onBlur, onKeyDown, allowCreate = false, onCreateSuccess, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [filter, setFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Derived state for display
    const selectedOption = options.find(o => o.value === value);
    const selectedLabel = selectedOption ? selectedOption.label : '';
    const [inputValue, setInputValue] = useState(selectedLabel);

    // Update input value when prop value changes
    useEffect(() => {
        const opt = options.find(o => o.value === value);
        if (opt) setInputValue(opt.label);
    }, [value, options]);

    const filteredOptions = options.filter(o =>
      o.label.toLowerCase().includes(filter.toLowerCase())
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (showCreateModal) return; // Let modal handle its own keys

        // Alt+C handler
        if (allowCreate && e.altKey && e.key.toLowerCase() === 'c') {
            console.log("Alt+C detected in TallySelect");
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            setShowCreateModal(true);
            setIsOpen(false);
            return;
        }

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
        if (!isOpen) setIsOpen(true);
        setHighlightedIndex(0);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!showCreateModal) {
            setTimeout(() => {
                setIsOpen(false);
                // If not matched, revert
                if (!options.find(o => o.label === inputValue) && inputValue !== '') {
                     const match = options.find(o => o.label.toLowerCase() === inputValue.toLowerCase());
                     if (match) {
                         handleSelect(match);
                     } else {
                         setInputValue(selectedLabel);
                     }
                }
            }, 200);
        }
        onBlur?.(e);
    };

    const handleCreateSave = (newId: string) => {
        setShowCreateModal(false);
        if (onCreateSuccess) {
            onCreateSuccess(newId);
        } else {
            onChange?.(newId);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
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

            {showCreateModal && (
                <CreateLedgerModal
                    onSave={handleCreateSave}
                    onCancel={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
  }
);
