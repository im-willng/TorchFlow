import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function GroupNormNode({ data }) {
    const [params, setParams] = useState({
        num_groups: data.params.num_groups || 32,
        num_channels: data.params.num_channels || 128
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

            <div className="node-title">📐 GROUPNORM</div>

            <div className="node-param">
                <label>Num Groups:</label>
                <input
                    type="number"
                    value={params.num_groups}
                    onChange={(e) => handleChange('num_groups', e.target.value)}
                />
            </div>

            <div className="node-param">
                <label>Num Channels:</label>
                <input
                    type="number"
                    value={params.num_channels}
                    onChange={(e) => handleChange('num_channels', e.target.value)}
                />
            </div>

            <div className="node-shape">
                G={params.num_groups}, C={params.num_channels}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default GroupNormNode;
