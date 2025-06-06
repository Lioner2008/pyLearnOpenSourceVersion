import React from 'react';

export const CodeEditor = ({ code, setCode, disabled }) => {
  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      disabled={disabled}
      className="flex-grow w-full p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-b-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none font-mono text-sm leading-relaxed shadow-inner"
      spellCheck="false"
      placeholder="Write your Python code here..."
      rows={10} // Default, flex-grow will manage height
    />
  );
}; 