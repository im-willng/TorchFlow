import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

function SiLUNode({ data }) {
    return (
        <div className="node-content">
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
