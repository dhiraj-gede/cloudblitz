import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search enquiries...',
}) => {
  return (
    <div className='relative w-full max-w-sm'>
      <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
        <Search className='w-4 h-4 text-muted-foreground' />
      </div>
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='bg-background text-foreground border border-input px-3 py-2 ps-10 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring'
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className='absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground'
        >
          <span className='sr-only'>Clear search</span>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      )}
    </div>
  );
};
