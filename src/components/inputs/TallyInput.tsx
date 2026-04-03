import React, { forwardRef } from 'react';

interface TallyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  textAlign?: 'left' | 'right' | 'center';
}

export const TallyInput = forwardRef<HTMLInputElement, TallyInputProps>(
  ({ className, textAlign = 'left', style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`tally-input ${className || ''}`}
        style={{ textAlign, ...style }}
        autoComplete="off"
        {...props}
      />
    );
  }
);
