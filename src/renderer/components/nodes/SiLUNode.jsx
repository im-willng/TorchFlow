import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function SiLUNode({ data, id }) {
    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">🌊 SILU/SWISH</div>

            <div className="node-shape">
                x · σ(x)
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default SiLUNode;
