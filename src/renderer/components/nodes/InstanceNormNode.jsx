import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function InstanceNormNode({ data, id }) {
    const [params, setParams] = useState({
        num_features: data.params.num_features || 128
    });

    const handleChange = (value) => {
        const val = parseInt(value) || 0;
        setParams({ num_features: val });
        data.params.num_features = val;
    };

    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">📍 INSTANCENORM</div>

            <div className="node-param">
                <label>Num Features:</label>
                <input
                    type="number"
                    value={params.num_features}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>

            <div className="node-shape">
                Features: {params.num_features}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default InstanceNormNode;
