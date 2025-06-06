export const MessageType = {
  STDOUT: 'stdout',
  STDERR: 'stderr',
  SYSTEM: 'system', // For app messages like "Running...", "Result:"
  PYODIDE_SYSTEM: 'pyodide_system', // For Pyodide's own internal messages
};

// TypeScript interfaces are removed in JavaScript conversion 