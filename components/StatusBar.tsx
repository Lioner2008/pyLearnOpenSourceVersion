
import React from 'react';

interface StatusBarProps {
  isLoading: boolean;
  statusMessage: string;
  pythonVersion: string | null;
  isRunning: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ isLoading, statusMessage, pythonVersion, isRunning }) => {
  let displayMessage = statusMessage;
  if (isRunning) {
    displayMessage = "Python code running...";
  } else if (!isLoading && pythonVersion) {
    displayMessage = `Pyodide Ready (Python ${pythonVersion})`;
  }


  return (
    <footer className="bg-gray-800 p-2 text-xs text-gray-400 border-t border-gray-700 flex justify-between items-center">
      <span>{displayMessage}</span>
      {(isLoading || isRunning) && (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {isRunning ? 'Executing' : 'Loading'}
        </div>
      )}
    </footer>
  );
};
