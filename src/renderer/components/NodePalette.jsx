import React, { useState } from 'react';
import './NodePalette.css';

const NODE_CATEGORIES = [
    {
        category: 'Input/Output',
        nodes: [
            { type: 'input', label: 'Input', icon: '📥' },
            { type: 'output', label: 'Output', icon: '📤' },
        ]
    },
    {
        category: 'Convolutional',
        nodes: [
            { type: 'conv1d', label: 'Conv1D', icon: '📊' },
            { type: 'conv2d', label: 'Conv2D', icon: '🔲' },
            { type: 'conv3d', label: 'Conv3D', icon: '🧊' },
            { type: 'convtranspose2d', label: 'TransposeConv2D', icon: '🔳' },
            { type: 'maxpool2d', label: 'MaxPool2D', icon: '⬇️' },
            { type: 'avgpool2d', label: 'AvgPool2D', icon: '📉' },
            { type: 'adaptiveavgpool2d', label: 'AdaptiveAvgPool', icon: '🎯' },
        ]
    },
    {
        category: 'Fully Connected',
        nodes: [
            { type: 'linear', label: 'Linear', icon: '➡️' },
            { type: 'flatten', label: 'Flatten', icon: '📏' },
        ]
    },
    {
        category: 'Recurrent',
        nodes: [
            { type: 'lstm', label: 'LSTM', icon: '🔄' },
            { type: 'gru', label: 'GRU', icon: '🔁' },
            { type: 'rnn', label: 'RNN', icon: '↩️' },
        ]
    },
    {
        category: 'Normalization',
        nodes: [
            { type: 'batchnorm', label: 'BatchNorm', icon: '📊' },
            { type: 'layernorm', label: 'LayerNorm', icon: '📏' },
            { type: 'groupnorm', label: 'GroupNorm', icon: '📐' },
            { type: 'instancenorm', label: 'InstanceNorm', icon: '📍' },
        ]
    },
    {
        category: 'Activation',
        nodes: [
            { type: 'relu', label: 'ReLU', icon: '⚡' },
            { type: 'leakyrelu', label: 'LeakyReLU', icon: '⚡' },
            { type: 'sigmoid', label: 'Sigmoid', icon: '📈' },
            { type: 'tanh', label: 'Tanh', icon: '〰️' },
            { type: 'gelu', label: 'GELU', icon: '✨' },
            { type: 'elu', label: 'ELU', icon: '💫' },
            { type: 'silu', label: 'SiLU/Swish', icon: '🌊' },
            { type: 'softmax', label: 'Softmax', icon: '🎯' },
        ]
    },
    {
        category: 'Utility',
        nodes: [
            { type: 'dropout', label: 'Dropout', icon: '💧' },
            { type: 'reshape', label: 'Reshape', icon: '🔄' },
            { type: 'concatenate', label: 'Concatenate', icon: '🔗' },
            { type: 'add', label: 'Add', icon: '➕' },
            { type: 'multiply', label: 'Multiply', icon: '✖️' },
            { type: 'embedding', label: 'Embedding', icon: '📚' },
        ]
    },
    {
        category: 'Attention',
        nodes: [
            { type: 'multiheadattention', label: 'MultiheadAttention', icon: '🎯' },
        ]
    }
];

function NodePalette({ onNodeDrop }) {
    const [isPaletteExpanded, setIsPaletteExpanded] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState(
        NODE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.category]: true }), {})
    );

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleClick = (nodeType) => {
        // Add node at center of canvas
        const position = { x: 250, y: 100 };
        onNodeDrop(nodeType, position);
    };

    return (
        <div className={`node-palette ${isPaletteExpanded ? 'expanded' : 'collapsed'}`}>
            <div
                className="palette-header-main"
                onClick={() => setIsPaletteExpanded(!isPaletteExpanded)}
            >
                <div className="palette-title">PyTorch Layers</div>
                <button className="palette-toggle-btn">
                    {isPaletteExpanded ? '−' : '+'}
                </button>
            </div>

            {isPaletteExpanded && (
                <div className="palette-categories">
                    {NODE_CATEGORIES.map(({ category, nodes }) => (
                        <div key={category} className="palette-category">
                            <div
                                className="category-header"
                                onClick={() => toggleCategory(category)}
                            >
                                <span className="category-toggle">
                                    {expandedCategories[category] ? '▼' : '▶'}
                                </span>
                                <span className="category-name">{category}</span>
                                <span className="category-count">({nodes.length})</span>
                            </div>
                            {expandedCategories[category] && (
                                <div className="palette-items">
                                    {nodes.map(({ type, label, icon }) => (
                                        <div
                                            key={type}
                                            className="palette-item"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, type)}
                                            onClick={() => handleClick(type)}
                                            title={label}
                                        >
                                            <span className="palette-icon">{icon}</span>
                                            <span className="palette-label">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NodePalette;
