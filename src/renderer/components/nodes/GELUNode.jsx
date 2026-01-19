import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function GELUNode({ data, id }) {
    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
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
