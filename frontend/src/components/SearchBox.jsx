import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const { theme } = useThemeStore()

  // Focus input when ⌘K or Ctrl+K is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full mx-auto rounded-3xl" data-theme={theme}>
      <div className="relative flex items-center group rounded-3xl">
        {/* Left Search Icon */}
        <Search 
          className="focus:outline-none focus:ring-0 absolute left-3 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition duration-300 pointer-events-none" 
        />
        
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search or start a new chat"
          className={"focus:outline-none focus:ring-0 w-full pl-10 pr-20 py-2.5 bg-white dark:bg-gray-900 border-gray-300 "+
            " dark:border-gray-700 rounded-3xl shadow-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 "+
            " focus:outline-none focus:ring-0 focus:ring-biege-500 focus:border-biege-500 transition-all text-sm"}
        />

        {/* Action Elements Container */}
        <div className="absolute right-3 flex items-center space-x-1.5">
          {/* Dynamic Clear Button */}
          {query && (
            <button
              onClick={handleClear}
              type="button"
              className={"p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"}
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Keyboard Shortcut Badge */}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 h-5 select-none rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-1.5 font-mono text-[10px] font-medium text-gray-400 pointer-events-none shadow-sm">
            <Command className="w-3 h-3" />K
          </kbd>
        </div>
      </div>
    </div>
  );
}
