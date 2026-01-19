import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function SigmoidNode({ data, id }) {
    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} />

            <div className="node-title">📈 SIGMOID</div>

            <div className="node-shape">
                σ(x) = 1/(1+e⁻ˣ)
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default SigmoidNode;
