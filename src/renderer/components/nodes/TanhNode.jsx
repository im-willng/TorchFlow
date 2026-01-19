import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

function TanhNode({ data }) {
    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">〰️ TANH</div>

            <div className="node-shape">
                tanh(x)
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default TanhNode;
