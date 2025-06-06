
import React, { useEffect, useRef } from 'react';
import { OutputMessage, MessageType } from '../types.ts';

interface OutputConsoleProps {
  messages: OutputMessage[];
}

const getMessageTypeStyles = (type: MessageType): string => {
  switch (type) {
    case MessageType.STDOUT:
      return 'text-gray-200';
    case MessageType.STDERR:
      return 'text-red-400';
    case MessageType.SYSTEM:
      return 'text-blue-400 italic';
    case MessageType.PYODIDE_SYSTEM:
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
};

export const OutputConsole: React.FC<OutputConsoleProps> = ({ messages }) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);

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
