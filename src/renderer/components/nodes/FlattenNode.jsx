import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

function FlattenNode({ data }) {
    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">📏 FLATTEN</div>

            <div className="node-shape">
                Flatten to 1D
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default FlattenNode;
