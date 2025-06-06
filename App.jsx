import React, { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from './components/CodeEditor.jsx';
import { OutputConsole } from './components/OutputConsole.jsx';
import { StatusBar } from './components/StatusBar.jsx';
import { PlayIcon } from './components/icons/PlayIcon.jsx';
import { ClearIcon } from './components/icons/ClearIcon.jsx';

// Declare global window properties for Pyodide - Removed
// declare global {
//   interface Window {
//     loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInstance>;
//   }
// }

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

const App = () => { // Removed React.FC type annotation
  const [pythonCode, setPythonCode] = useState(DEFAULT_PYTHON_CODE); // Removed type annotation
  const [outputMessages, setOutputMessages] = useState([]); // Removed type annotation
  const [pyodide, setPyodide] = useState(null); // Removed type annotation
  const [isPyodideLoading, setIsPyodideLoading] = useState(true); // Removed type annotation
  const [pyodideLoadMessage, setPyodideLoadMessage] = useState("Initializing Pyodide..."); // Removed type annotation
  const [isRunningCode, setIsRunningCode] = useState(false); // Removed type annotation
  const [pythonVersion, setPythonVersion] = useState(null); // Removed type annotation

  const addMessage = useCallback((text, type) => { // Removed type annotations for parameters
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
      addMessage("Loading Pyodide...", "PYODIDE_SYSTEM"); // Using string literal instead of MessageType enum
      setPyodideLoadMessage("Loading Pyodide runtime...");
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
        });

        pyodideInstance.setStdout({
          batched: (msg) => addMessage(msg, "STDOUT"), // Removed type annotation and using string literal
        });
        pyodideInstance.setStderr({
          batched: (msg) => addMessage(msg, "STDERR"), // Removed type annotation and using string literal
        });
        
        setPyodide(pyodideInstance);
        
        const version = await pyodideInstance.runPythonAsync(`
          import sys
          sys.version
        `);
        setPythonVersion(version.split(' ')[0]);
        setIsPyodideLoading(false);
        setPyodideLoadMessage(`Pyodide Ready (Python ${version.split(' ')[0]})`);
        addMessage(`Pyodide loaded successfully. Python ${version}`, "PYODIDE_SYSTEM"); // Using string literal

      } catch (error) {
        console.error("Failed to load Pyodide:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setPyodideLoadMessage(`Error loading Pyodide: ${errorMessage}`);
        addMessage(`Error loading Pyodide: ${errorMessage}`, "STDERR"); // Using string literal
        setIsPyodideLoading(false);
      }
    };
    loadPyodideInstance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMessage]);

  const handleRunCode = useCallback(async () => {
    if (!pyodide || isRunningCode || isPyodideLoading) return;

    setIsRunningCode(true);
    addMessage("Executing Python code...", "SYSTEM"); // Using string literal
    try {
      const result = await pyodide.runPythonAsync(pythonCode);
      if (result !== undefined) {
        addMessage(`Expression Result: ${String(result)}`, "SYSTEM"); // Using string literal
      }
      addMessage("Execution finished.", "SYSTEM"); // Using string literal
    } catch (error) {
      console.error("Error executing Python code:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      addMessage(`Runtime Error: ${errorMessage}`, "STDERR"); // Using string literal
    } finally {
      setIsRunningCode(false);
    }
  }, [pyodide, pythonCode, addMessage, isRunningCode, isPyodideLoading]);

  const handleClearOutput = useCallback(() => {
    setOutputMessages([]);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <div className="flex flex-grow">
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-6 border-r border-gray-700">
          <div className="w-10 h-10 bg-yellow-500 rounded-full"></div>
          <div className="w-10 h-10 bg-blue-500 rounded-md"></div>
        </div>

        <main className="flex-grow flex flex-col overflow-hidden p-1">
          <div className="w-full h-1/2 p-1 flex flex-col">
             <h2 className="sr-only">Python Code Editor</h2>
            <CodeEditor
              code={pythonCode}
              setCode={setPythonCode}
              disabled={isRunningCode || isPyodideLoading}
            />
          </div>

          <div className="w-full h-1/2 p-1 flex flex-col relative">
             <h2 className="sr-only">Output Console</h2>
            <OutputConsole messages={outputMessages} />

            <button
              onClick={handleRunCode}
              disabled={isPyodideLoading || isRunningCode || !pyodide}
              className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Start
            </button>
          </div>
        </main>
      </div>

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