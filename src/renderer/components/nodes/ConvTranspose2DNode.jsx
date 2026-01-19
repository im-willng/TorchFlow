import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function ConvTranspose2DNode({ data }) {
    const [params, setParams] = useState({
        in_channels: data.params.in_channels || 32,
        out_channels: data.params.out_channels || 16,
        kernel_size: data.params.kernel_size || 3,
        stride: data.params.stride || 2,
        padding: data.params.padding || 1
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

            <div className="node-title">🔳 TRANSPOSE CONV2D</div>

            <div className="node-param">
                <label>In Channels:</label>
                <input
                    type="number"
                    value={params.in_channels}
                    onChange={(e) => handleChange('in_channels', e.target.value)}
                />
            </div>

            <div className="node-param">
                <label>Out Channels:</label>
                <input
                    type="number"
                    value={params.out_channels}
                    onChange={(e) => handleChange('out_channels', e.target.value)}
                />
            </div>

            <div className="node-param">
                <label>Kernel Size:</label>
                <input
                    type="number"
                    value={params.kernel_size}
                    onChange={(e) => handleChange('kernel_size', e.target.value)}
                />
            </div>

            <div className="node-shape">
                Upsample: S={params.stride}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default ConvTranspose2DNode;
