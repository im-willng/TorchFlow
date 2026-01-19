import React, { useState } from 'react';
import './ControlPanel.css';

function ControlPanel({ onValidate, onTrain, onStop, onExport, onGenerateCode, isTraining, modelInfo }) {
    const [config, setConfig] = useState({
        optimizer: 'adam',
        lr: 0.001,
        epochs: 10,
        batch_size: 64
    });
    const [isExpanded, setIsExpanded] = useState(true);

    const handleTrain = () => {
        onTrain(config);
    };

    return (
        <div className={`control-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="panel-header" onClick={() => setIsExpanded(!isExpanded)}>
                <h2>Training Configuration</h2>
                <svg
                    className={`chevron ${isExpanded ? 'expanded' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <div className={`panel-content ${isExpanded ? 'expanded' : ''}`}>
                <div className="config-section">
                    <label>Optimizer</label>
                    <select
                        value={config.optimizer}
                        onChange={(e) => setConfig({ ...config, optimizer: e.target.value })}
                        disabled={isTraining}
                    >
                        <option value="adam">Adam</option>
                        <option value="sgd">SGD</option>
                    </select>
                </div>

                <div className="config-section">
                    <label>Learning Rate</label>
                    <input
                        type="number"
                        step="0.0001"
                        value={config.lr}
                        onChange={(e) => setConfig({ ...config, lr: parseFloat(e.target.value) })}
                        disabled={isTraining}
                    />
                </div>

                <div className="config-section">
                    <label>Epochs</label>
                    <input
                        type="number"
                        value={config.epochs}
                        onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })}
                        disabled={isTraining}
                    />
                </div>

                <div className="config-section">
                    <label>Batch Size</label>
                    <input
                        type="number"
                        value={config.batch_size}
                        onChange={(e) => setConfig({ ...config, batch_size: parseInt(e.target.value) })}
                        disabled={isTraining}
                    />
                </div>

                {modelInfo && (
                    <div className="model-info">
                        <strong>Total Parameters:</strong> {modelInfo.totalParams.toLocaleString()}
                    </div>
                )}

                <div className="button-group">
                    <button onClick={onValidate} disabled={isTraining} className="btn btn-secondary">
                        Validate Graph
                    </button>
                    <button onClick={onGenerateCode} disabled={isTraining} className="btn btn-secondary">
                        Generate Code
                    </button>
                </div>

                <div className="button-group">
                    {!isTraining ? (
                        <button onClick={handleTrain} className="btn btn-primary">
                            Start Training
                        </button>
                    ) : (
                        <button onClick={onStop} className="btn btn-danger">
                            Stop Training
                        </button>
                    )}
                </div>

                <div className="button-group">
                    <button onClick={onExport} disabled={isTraining} className="btn btn-success">
                        Export Model
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ControlPanel;
