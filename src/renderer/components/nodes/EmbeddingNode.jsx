import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

function EmbeddingNode({ data }) {
    const [params, setParams] = useState({
        num_embeddings: data.params.num_embeddings || 10000,
        embedding_dim: data.params.embedding_dim || 128
    });

    const handleChange = (key, value) => {
        const val = parseInt(value) || 0;
        const newParams = { ...params, [key]: val };
        setParams(newParams);
        data.params[key] = val;
    };

    return (
        <div className="node-content">
            <Handle type="target" position={Position.Left} />

            <div className="node-title">📚 EMBEDDING</div>

            <div className="node-param">
                <label>Num Embeddings:</label>
                <input
                    type="number"
                    value={params.num_embeddings}
                    onChange={(e) => handleChange('num_embeddings', e.target.value)}
                />
            </div>

            <div className="node-param">
                <label>Embedding Dim:</label>
                <input
                    type="number"
                    value={params.embedding_dim}
                    onChange={(e) => handleChange('embedding_dim', e.target.value)}
                />
            </div>

            <div className="node-shape">
                {params.num_embeddings} → {params.embedding_dim}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default EmbeddingNode;
