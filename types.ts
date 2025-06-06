
export enum MessageType {
  STDOUT = 'stdout',
  STDERR = 'stderr',
  SYSTEM = 'system', // For app messages like "Running...", "Result:"
  PYODIDE_SYSTEM = 'pyodide_system', // For Pyodide's own internal messages
}

export interface OutputMessage {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
}

// Minimal Pyodide interface for type safety with CDN-loaded library
export interface PyodideInstance {
  runPythonAsync: (code: string, options?: { globals?: any }) => Promise<any>;
  setStdout: (options: { batched?: (msg: string) => void, raw?: (msg: string) => void } | ((msg: string) => void)) => void;
  setStderr: (options: { batched?: (msg: string) => void, raw?: (msg: string) => void } | ((msg: string) => void)) => void;
  // loadPackage: (packages: string[] | string, options?: { messageCallback?: (msg: string) => void, errorCallback?: (err: string) => void }) => Promise<void>;
  // Define other Pyodide methods you might use
}
