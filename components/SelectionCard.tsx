import React from 'react';

interface SelectionCardProps<T extends string | number> {
  title: string;
  options: { value: T; label: string; subLabel?: string }[];
  selectedValue: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export const SelectionCard = <T extends string | number>({
  title,
  options,
  selectedValue,
  onChange,
  disabled
}: SelectionCardProps<T>) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 block">{title}</h3>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200
              ${selectedValue === option.value
                ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm ring-1 ring-primary-500 dark:bg-primary-900/30 dark:border-primary-400 dark:text-primary-300'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750 dark:hover:border-slate-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="font-bold text-lg">{option.label}</span>
            {option.subLabel && (
              <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">{option.subLabel}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};