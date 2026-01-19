import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function AdaptiveAvgPool2DNode({ data }) {
    const [params, setParams] = useState({
        output_size: data.params.output_size || 1
    });

    const handleChange = (value) => {
        const val = parseInt(value) || 1;
        setParams({ output_size: val });
        data.params.output_size = val;
    };

    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">🎯 ADAPTIVE AVGPOOL</div>

            <div className="node-param">
                <label>Output Size:</label>
                <input
                    type="number"
                    value={params.output_size}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>

            <div className="node-shape">
                Out: {params.output_size}×{params.output_size}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default AdaptiveAvgPool2DNode;
