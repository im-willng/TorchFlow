import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function NormNode({ data, id }) {
    const [numFeatures, setNumFeatures] = useState(data.params.num_features || 128);

    const handleChange = (value) => {
        const val = parseInt(value) || 0;
        setNumFeatures(val);
        data.params.num_features = val;
    };

    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">📊 BATCHNORM</div>

            <div className="node-param">
                <label>Num Features:</label>
                <input
                    type="number"
                    value={numFeatures}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>

            <div className="node-shape">
                Normalize {numFeatures} features
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default NormNode;
