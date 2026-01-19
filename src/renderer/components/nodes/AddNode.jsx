import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

function AddNode({ data }) {
    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} id="input1" style={{ top: '30%' }} />
            <Handle type="target" position={Position.Left} id="input2" style={{ top: '70%' }} />

            <div className="node-title">➕ ADD</div>

            <div className="node-shape">
                x₁ + x₂
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default AddNode;
