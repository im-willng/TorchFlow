import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

function GELUNode({ data }) {
    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">✨ GELU</div>

            <div className="node-shape">
                Gaussian Error Linear Unit
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default GELUNode;
