import React, { useEffect, useRef } from 'react';

const getMessageTypeStyles = (type) => {
  switch (type) {
    case 'stdout':
      return 'text-gray-200';
    case 'stderr':
      return 'text-red-400';
    case 'system':
      return 'text-blue-400 italic';
    case 'pyodide_system':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
};

export const OutputConsole = ({ messages }) => {
  const consoleEndRef = useRef(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow w-full p-3 bg-gray-800 border border-gray-700 rounded-b-md overflow-y-auto font-mono text-sm leading-relaxed shadow-inner">
      {messages.map((msg) => (
        <div key={msg.id} className={`whitespace-pre-wrap ${getMessageTypeStyles(msg.type)} mb-1`}>
          <span className="text-gray-500 text-xs mr-2 select-none">
            [{msg.timestamp.toLocaleTimeString()}]
          </span>
          {msg.text}
        </div>
      ))}
      <div ref={consoleEndRef} />
    </div>
  );
}; 