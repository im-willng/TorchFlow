import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function ReshapeNode({ data, id }) {
    const [params, setParams] = useState({
        target_shape: data.params.target_shape || '-1, 784'
    });

    const handleChange = (value) => {
        setParams({ target_shape: value });
        data.params.target_shape = value;
    };

    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">🔄 RESHAPE</div>

            <div className="node-param">
                <label>Target Shape:</label>
                <input
                    type="text"
                    value={params.target_shape}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="-1, 784"
                />
            </div>

            <div className="node-shape">
                → ({params.target_shape})
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default ReshapeNode;
