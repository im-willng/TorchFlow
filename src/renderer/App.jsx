import React, { useState, useCallback, useEffect } from 'react';
import NodeEditor from './components/NodeEditor';
import ControlPanel from './components/ControlPanel';
import TrainingChart from './components/TrainingChart';
import './App.css';

function App() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [trainingData, setTrainingData] = useState([]);
    const [isTraining, setIsTraining] = useState(false);
    const [modelInfo, setModelInfo] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Listen for Python events
        window.electronAPI.on('python-event', (data) => {
            handlePythonEvent(data);
        });

        window.electronAPI.on('python-error', (error) => {
            addLog(`Error: ${error}`, 'error');
        });

        return () => {
            window.electronAPI.removeAllListeners('python-event');
            window.electronAPI.removeAllListeners('python-error');
        };
    }, []);

    const handlePythonEvent = (event) => {
        const { event: eventType, data } = event;

        switch (eventType) {
            case 'ready':
                addLog('Backend ready', 'info');
                break;

            case 'validation_success':
                addLog(`Graph validated: ${data.node_count} nodes, ${data.total_params} params`, 'success');
                setModelInfo({ totalParams: data.total_params });
                break;

            case 'validation_error':
                addLog(`Validation errors: ${data.errors.join(', ')}`, 'error');
                break;

            case 'training_start':
                setIsTraining(true);
                setTrainingData([]);
                addLog(`Training started: ${data.epochs} epochs`, 'info');
                break;

            case 'epoch_end':
                setTrainingData(prev => [...prev, {
                    epoch: data.epoch,
                    loss: data.loss,
                    accuracy: data.accuracy
                }]);
                addLog(`Epoch ${data.epoch}: Loss=${data.loss.toFixed(4)}, Acc=${(data.accuracy * 100).toFixed(2)}%`, 'info');
                break;

            case 'training_complete':
                setIsTraining(false);
                addLog(`Training complete! Final accuracy: ${(data.final_accuracy * 100).toFixed(2)}%`, 'success');
                break;

            case 'code_generated':
                addLog('Code generated successfully', 'success');
                break;

            case 'export_complete':
                addLog(`Model exported to: ${data.files.code}`, 'success');
                break;

            case 'error':
                addLog(`Error: ${data.message}`, 'error');
                setIsTraining(false);
                break;
        }
    };

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-50), { timestamp, message, type }]);
    };

    const handleValidate = useCallback(() => {
        const graph = { nodes, edges };
        window.electronAPI.send('python-command', {
            command: 'validate',
            graph
        });
    }, [nodes, edges]);

    const handleTrain = useCallback((config) => {
        const graph = { nodes, edges };
        window.electronAPI.send('python-command', {
            command: 'train',
            graph,
            config
        });
    }, [nodes, edges]);

    const handleStop = useCallback(() => {
        window.electronAPI.send('stop-training');
        setIsTraining(false);
        addLog('Training stopped', 'warning');
    }, []);

    const handleExport = useCallback(() => {
        window.electronAPI.send('python-command', {
            command: 'export',
            path: './exports'
        });
    }, []);

    const handleGenerateCode = useCallback(() => {
        const graph = { nodes, edges };
        window.electronAPI.send('python-command', {
            command: 'generate_code',
            graph
        });
    }, [nodes, edges]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="app">
            <div className={`main-content ${!isSidebarOpen ? 'expanded' : ''}`}>
                <NodeEditor
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={setNodes}
                    onEdgesChange={setEdges}
                />
                <button
                    className={`sidebar-toggle ${isSidebarOpen ? 'open' : 'closed'}`}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d={isSidebarOpen ? "M9 18L15 12L9 6" : "M15 18L9 12L15 6"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <ControlPanel
                    onValidate={handleValidate}
                    onTrain={handleTrain}
                    onStop={handleStop}
                    onExport={handleExport}
                    onGenerateCode={handleGenerateCode}
                    isTraining={isTraining}
                    modelInfo={modelInfo}
                />
                <TrainingChart data={trainingData} />
                <div className="logs">
                    <h3>Logs</h3>
                    <div className="log-container">
                        {logs.map((log, idx) => (
                            <div key={idx} className={`log-entry log-${log.type}`}>
                                <span className="log-time">{log.timestamp}</span>
                                <span className="log-message">{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
