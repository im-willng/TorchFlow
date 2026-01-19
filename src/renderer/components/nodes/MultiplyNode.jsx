import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DeleteButton } from './DeleteButton';

function MultiplyNode({ data, id }) {
    return (
        <div className="node-content">
            <DeleteButton nodeId={id} />
            <Handle type="target" position={Position.Left} id="input1" style={{ top: '30%' }} />
            <Handle type="target" position={Position.Left} id="input2" style={{ top: '70%' }} />

            <div className="node-title">✖️ MULTIPLY</div>

            <div className="node-shape">
                x₁ × x₂
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default MultiplyNode;
