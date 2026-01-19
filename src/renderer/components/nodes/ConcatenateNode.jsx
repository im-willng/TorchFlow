import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function ConcatenateNode({ data }) {
    const [params, setParams] = useState({
        dim: data.params.dim || 1
    });

    const handleChange = (value) => {
        const val = parseInt(value) || 1;
        setParams({ dim: val });
        data.params.dim = val;
    };

    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} id="input1" style={{ top: '30%' }} />
            <Handle type="target" position={Position.Left} id="input2" style={{ top: '70%' }} />

            <div className="node-title">🔗 CONCATENATE</div>

            <div className="node-param">
                <label>Dimension:</label>
                <input
                    type="number"
                    value={params.dim}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>

            <div className="node-shape">
                Concat on dim={params.dim}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default ConcatenateNode;
