import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function ActivationNode({ data, id }) {
    const isReLU = data.label === 'RELU';
    const icon = isReLU ? '⚡' : '🎯';
    const label = isReLU ? 'ReLU' : 'Softmax';

    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
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
