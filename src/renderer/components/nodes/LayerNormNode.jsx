import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function LayerNormNode({ data }) {
    const [params, setParams] = useState({
        normalized_shape: data.params.normalized_shape || 128
    });

    const handleChange = (value) => {
        const val = parseInt(value) || 0;
        setParams({ normalized_shape: val });
        data.params.normalized_shape = val;
    };

    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">📏 LAYERNORM</div>

            <div className="node-param">
                <label>Normalized Shape:</label>
                <input
                    type="number"
                    value={params.normalized_shape}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>

            <div className="node-shape">
                Shape: {params.normalized_shape}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default LayerNormNode;
