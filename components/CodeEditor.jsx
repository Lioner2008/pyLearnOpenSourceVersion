import React from 'react';
import Editor from '@monaco-editor/react';

// interface CodeEditorProps {
//   code: string;
//   setCode: (code: string) => void;
//   disabled?: boolean;
// }

export const CodeEditor = ({ code, setCode, disabled }) => {
  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  return (
    <div className="flex-grow w-full border border-gray-700 rounded-b-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: disabled,
          automaticLayout: true,
          theme: 'vs-dark',
          wordWrap: 'on',
          padding: { top: 10, bottom: 10 },
        }}
      />
    </div>
  );
};
