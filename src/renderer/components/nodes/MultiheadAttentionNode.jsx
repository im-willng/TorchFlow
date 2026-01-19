import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function MultiheadAttentionNode({ data }) {
    const [params, setParams] = useState({
        embed_dim: data.params.embed_dim || 512,
        num_heads: data.params.num_heads || 8
    });

    const handleChange = (key, value) => {
        const val = parseInt(value) || 0;
        const newParams = { ...params, [key]: val };
        setParams(newParams);
        data.params[key] = val;
    };

    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} id="query" style={{ top: '25%' }} />
            <Handle type="target" position={Position.Left} id="key" style={{ top: '50%' }} />
            <Handle type="target" position={Position.Left} id="value" style={{ top: '75%' }} />

            <div className="node-title">🎯 MULTIHEAD ATTENTION</div>

            <div className="node-param">
                <label>Embed Dim:</label>
                <input
                    type="number"
                    value={params.embed_dim}
                    onChange={(e) => handleChange('embed_dim', e.target.value)}
                />
            </div>

            <div className="node-param">
                <label>Num Heads:</label>
                <input
                    type="number"
                    value={params.num_heads}
                    onChange={(e) => handleChange('num_heads', e.target.value)}
                />
            </div>

            <div className="node-shape">
                H={params.num_heads}, D={params.embed_dim}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default MultiheadAttentionNode;
