import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

function ActivationNode({ data }) {
    const isReLU = data.label === 'RELU';
    const icon = isReLU ? '⚡' : '🎯';
    const label = isReLU ? 'ReLU' : 'Softmax';

    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">{icon} {label.toUpperCase()}</div>

            <div className="node-shape">
                Activation Function
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default ActivationNode;
