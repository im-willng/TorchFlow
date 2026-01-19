import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function TanhNode({ data, id }) {
    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
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
