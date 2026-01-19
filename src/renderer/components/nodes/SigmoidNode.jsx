import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

function SigmoidNode({ data }) {
    return (
        <div className="node-content">
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
