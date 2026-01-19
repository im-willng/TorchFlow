import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function RNNNode({ data, id }) {
    const [params, setParams] = useState({
        input_size: data.params.input_size || 128,
        hidden_size: data.params.hidden_size || 256,
        num_layers: data.params.num_layers || 1
    });

    const handleChange = (key, value) => {
        const val = parseInt(value) || 0;
        const newParams = { ...params, [key]: val };
        setParams(newParams);
        data.params[key] = val;
    };

    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">↩️ RNN</div>

            <div className="node-param">
                <label>Input Size:</label>
                <input
                    type="number"
                    value={params.input_size}
                    onChange={(e) => handleChange('input_size', e.target.value)}
                />
            </div>

            <div className="node-param">
                <label>Hidden Size:</label>
                <input
                    type="number"
                    value={params.hidden_size}
                    onChange={(e) => handleChange('hidden_size', e.target.value)}
                />
            </div>

            <div className="node-param">
                <label>Num Layers:</label>
                <input
                    type="number"
                    value={params.num_layers}
                    onChange={(e) => handleChange('num_layers', e.target.value)}
                />
            </div>

            <div className="node-shape">
                H={params.hidden_size}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default RNNNode;
