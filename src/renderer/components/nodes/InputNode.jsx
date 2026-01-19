import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function InputNode({ data }) {
    const [shape, setShape] = useState(data.params.shape || [1, 28, 28]);

    const handleShapeChange = (index, value) => {
        const newShape = [...shape];
        newShape[index] = parseInt(value) || 0;
        setShape(newShape);
        data.params.shape = newShape;
    };

    return (
        <div className="node-content">
            <div className="node-title">📥 INPUT</div>

            <div className="node-param">
                <label>Batch:</label>
                <input
                    type="number"
                    value={shape[0]}
                    onChange={(e) => handleShapeChange(0, e.target.value)}
                />
            </div>

            {shape.length > 1 && (
                <div className="node-param">
                    <label>Channels:</label>
                    <input
                        type="number"
                        value={shape[1]}
                        onChange={(e) => handleShapeChange(1, e.target.value)}
                    />
                </div>
            )}

            {shape.length > 2 && (
                <div className="node-param">
                    <label>Height:</label>
                    <input
                        type="number"
                        value={shape[2]}
                        onChange={(e) => handleShapeChange(2, e.target.value)}
                    />
                </div>
            )}

            {shape.length > 3 && (
                <div className="node-param">
                    <label>Width:</label>
                    <input
                        type="number"
                        value={shape[3]}
                        onChange={(e) => handleShapeChange(3, e.target.value)}
                    />
                </div>
            )}

            <div className="node-shape">Shape: [{shape.join(', ')}]</div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default InputNode;
