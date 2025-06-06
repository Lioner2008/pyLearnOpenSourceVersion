import React, { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { OutputConsole } from './components/OutputConsole';
import { StatusBar } from './components/StatusBar';
import { PlayIcon } from './components/icons/PlayIcon';
import { ClearIcon } from './components/icons/ClearIcon';

const DEFAULT_PYTHON_CODE = `import sys
import platform
import time

print(f"Hello from Pyodide! Running on {platform.system()}")
print(f"Python version: {sys.version}")

print("\\nCalculating a sum...")
time.sleep(0.5) # Simulate some work
a = 10
b = 20
result = a + b
print(f"{a} + {b} = {result}")

# The last expression's value will be returned by runPythonAsync
result * 2
`;

const App = () => {
  const [pythonCode, setPythonCode] = useState(DEFAULT_PYTHON_CODE);
  const [outputMessages, setOutputMessages] = useState([]);
  const [pyodide, setPyodide] = useState(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [pyodideLoadMessage, setPyodideLoadMessage] = useState("Initializing Pyodide...");
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [pythonVersion, setPythonVersion] = useState(null);

  const addMessage = useCallback((text, type) => {
    setOutputMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        type,
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    const loadPyodideInstance = async () => {
      addMessage("Loading Pyodide...", 'pyodide_system');
      setPyodideLoadMessage("Loading Pyodide runtime...");
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
        });

        pyodideInstance.setStdout({
          batched: (msg) => addMessage(msg, 'stdout'),
        });
        pyodideInstance.setStderr({
          batched: (msg) => addMessage(msg, 'stderr'),
        });
        
        setPyodide(pyodideInstance);
        
        const version = await pyodideInstance.runPythonAsync(`
          import sys
          sys.version
        `);
        setPythonVersion(version.split(' ')[0]);
        setIsPyodideLoading(false);
        setPyodideLoadMessage(`Pyodide Ready (Python ${version.split(' ')[0]})`);
        addMessage(`Pyodide loaded successfully. Python ${version}`, 'pyodide_system');

      } catch (error) {
        console.error("Failed to load Pyodide:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setPyodideLoadMessage(`Error loading Pyodide: ${errorMessage}`);
        addMessage(`Error loading Pyodide: ${errorMessage}`, 'stderr');
        setIsPyodideLoading(false);
      }
    };
    loadPyodideInstance();
  }, [addMessage]);

  const handleRunCode = useCallback(async () => {
    if (!pyodide || isRunningCode || isPyodideLoading) return;

    setIsRunningCode(true);
    addMessage("Executing Python code...", 'system');
    try {
      const result = await pyodide.runPythonAsync(pythonCode);
      if (result !== undefined) {
        addMessage(`Expression Result: ${String(result)}`, 'system');
      }
      addMessage("Execution finished.", 'system');
    } catch (error) {
      console.error("Error executing Python code:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      addMessage(`Runtime Error: ${errorMessage}`, 'stderr');
    } finally {
      setIsRunningCode(false);
    }
  }, [pyodide, pythonCode, addMessage, isRunningCode, isPyodideLoading]);

  const handleClearOutput = useCallback(() => {
    setOutputMessages([]);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-3 shadow-md flex items-center justify-between border-b border-gray-700">
        <h1 className="text-xl font-semibold text-cyan-400">Pyodide Web IDE</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunCode}
            disabled={isPyodideLoading || isRunningCode || !pyodide}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            Run Code
          </button>
          <button
            onClick={handleClearOutput}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <ClearIcon className="h-5 w-5 mr-2" />
            Clear Output
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden p-1">
        <div className="w-full md:w-1/2 h-1/2 md:h-full p-1 flex flex-col">
           <h2 className="text-sm font-semibold mb-1 px-2 py-1 bg-gray-700 rounded-t-md text-gray-300">Python Code Editor</h2>
          <CodeEditor
            code={pythonCode}
            setCode={setPythonCode}
            disabled={isRunningCode || isPyodideLoading}
          />
        </div>
        <div className="w-full md:w-1/2 h-1/2 md:h-full p-1 flex flex-col">
           <h2 className="text-sm font-semibold mb-1 px-2 py-1 bg-gray-700 rounded-t-md text-gray-300">Output Console</h2>
          <OutputConsole messages={outputMessages} />
        </div>
      </main>

      <StatusBar
        isLoading={isPyodideLoading}
        statusMessage={pyodideLoadMessage}
        pythonVersion={pythonVersion}
        isRunning={isRunningCode}
      />
    </div>
  );
};

export default App; 