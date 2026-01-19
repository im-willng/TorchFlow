import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function LeakyReLUNode({ data, id }) {
    const [params, setParams] = useState({
        negative_slope: data.params.negative_slope || 0.01
    });

    const handleChange = (value) => {
        const val = parseFloat(value) || 0.01;
        setParams({ negative_slope: val });
        data.params.negative_slope = val;
    };

    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">⚡ LEAKY RELU</div>

            <div className="node-param">
                <label>Negative Slope:</label>
                <input
                    type="number"
                    step="0.01"
                    value={params.negative_slope}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>

            <div className="node-shape">
                α={params.negative_slope}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default LeakyReLUNode;
