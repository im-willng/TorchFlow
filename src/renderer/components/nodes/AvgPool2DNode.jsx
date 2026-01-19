import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function AvgPool2DNode({ data }) {
    const [params, setParams] = useState({
        kernel_size: data.params.kernel_size || 2,
        stride: data.params.stride || 2,
        padding: data.params.padding || 0
    });

    const handleChange = (key, value) => {
        const val = parseInt(value) || 0;
        const newParams = { ...params, [key]: val };
        setParams(newParams);
        data.params[key] = val;
    };

    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">📉 AVGPOOL2D</div>

            <div className="node-param">
                <label>Kernel Size:</label>
                <input
                    type="number"
                    value={params.kernel_size}
                    onChange={(e) => handleChange('kernel_size', e.target.value)}
                />
            </div>

            <div className="node-param">
                <label>Stride:</label>
                <input
                    type="number"
                    value={params.stride}
                    onChange={(e) => handleChange('stride', e.target.value)}
                />
            </div>

            <div className="node-shape">
                Avg: K={params.kernel_size}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default AvgPool2DNode;
