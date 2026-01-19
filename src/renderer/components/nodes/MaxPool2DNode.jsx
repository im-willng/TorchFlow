import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function MaxPool2DNode({ data, id }) {
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
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">⬇️ MAXPOOL2D</div>

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
                K={params.kernel_size}, S={params.stride}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default MaxPool2DNode;
