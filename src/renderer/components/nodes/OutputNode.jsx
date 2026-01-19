import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function OutputNode({ data, id }) {
    const [outputType, setOutputType] = useState(data.params.outputType || 'classification');
    const [numClasses, setNumClasses] = useState(data.params.numClasses || 10);

    const handleOutputTypeChange = (value) => {
        setOutputType(value);
        data.params.outputType = value;
    };

    const handleNumClassesChange = (value) => {
        const parsed = parseInt(value) || 1;
        setNumClasses(parsed);
        data.params.numClasses = parsed;
    };

    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <div className="node-title">📤 OUTPUT</div>

            <div className="node-param">
                <label>Type:</label>
                <select
                    value={outputType}
                    onChange={(e) => handleOutputTypeChange(e.target.value)}
                >
                    <option value="classification">Classification</option>
                    <option value="regression">Regression</option>
                    <option value="binary">Binary</option>
                    <option value="multilabel">Multi-label</option>
                </select>
            </div>

            {(outputType === 'classification' || outputType === 'multilabel') && (
                <div className="node-param">
                    <label>Classes:</label>
                    <input
                        type="number"
                        min="1"
                        value={numClasses}
                        onChange={(e) => handleNumClassesChange(e.target.value)}
                    />
                </div>
            )}

            <div className="node-info">
                Output: {outputType}
                {(outputType === 'classification' || outputType === 'multilabel') && ` (${numClasses} classes)`}
            </div>

            <Handle type="target" position={Position.Left} />
        </div>
    );
}

export default OutputNode;
