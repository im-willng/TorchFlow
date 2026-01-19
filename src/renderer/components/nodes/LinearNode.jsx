import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function LinearNode({ data }) {
    const [inFeatures, setInFeatures] = useState(data.params.in_features || 784);
    const [outFeatures, setOutFeatures] = useState(data.params.out_features || 128);

    const handleInChange = (value) => {
        const val = parseInt(value) || 0;
        setInFeatures(val);
        data.params.in_features = val;
    };

    const handleOutChange = (value) => {
        const val = parseInt(value) || 0;
        setOutFeatures(val);
        data.params.out_features = val;
    };

    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">➡️ LINEAR</div>

            <div className="node-param">
                <label>In Features:</label>
                <input
                    type="number"
                    value={inFeatures}
                    onChange={(e) => handleInChange(e.target.value)}
                />
            </div>

            <div className="node-param">
                <label>Out Features:</label>
                <input
                    type="number"
                    value={outFeatures}
                    onChange={(e) => handleOutChange(e.target.value)}
                />
            </div>

            <div className="node-shape">
                {inFeatures} → {outFeatures}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default LinearNode;
