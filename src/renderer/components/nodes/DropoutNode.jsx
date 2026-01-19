import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function DropoutNode({ data, id }) {
    const [p, setP] = useState(data.params.p || 0.5);

    const handleChange = (value) => {
        const val = parseFloat(value) || 0;
        setP(val);
        data.params.p = val;
    };

    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">💧 DROPOUT</div>

            <div className="node-param">
                <label>Probability:</label>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={p}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>

            <div className="node-shape">
                Drop {(p * 100).toFixed(0)}% of neurons
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default DropoutNode;
