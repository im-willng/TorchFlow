import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function ELUNode({ data, id }) {
    const [params, setParams] = useState({
        alpha: data.params.alpha || 1.0
    });

    const handleChange = (value) => {
        const val = parseFloat(value) || 1.0;
        setParams({ alpha: val });
        data.params.alpha = val;
    };

    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">💫 ELU</div>

            <div className="node-param">
                <label>Alpha:</label>
                <input
                    type="number"
                    step="0.1"
                    value={params.alpha}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>

            <div className="node-shape">
                α={params.alpha}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default ELUNode;
