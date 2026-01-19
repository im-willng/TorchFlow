import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function LSTMNode({ data }) {
    const [params, setParams] = useState({
        input_size: data.params.input_size || 128,
        hidden_size: data.params.hidden_size || 256,
        num_layers: data.params.num_layers || 1,
        bidirectional: data.params.bidirectional || false
    });

    const handleChange = (key, value) => {
        let val = value;
        if (key === 'bidirectional') {
            val = value === 'true' || value === true;
        } else {
            val = parseInt(value) || 0;
        }
        const newParams = { ...params, [key]: val };
        setParams(newParams);
        data.params[key] = val;
    };

    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">🔄 LSTM</div>

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

            <div className="node-param">
                <label>Bidirectional:</label>
                <select
                    value={params.bidirectional.toString()}
                    onChange={(e) => handleChange('bidirectional', e.target.value)}
                >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
            </div>

            <div className="node-shape">
                H={params.hidden_size}, L={params.num_layers}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default LSTMNode;
