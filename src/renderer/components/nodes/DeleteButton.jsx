import React from 'react';
import { useReactFlow } from 'react-flow-renderer';

export function useDeleteNode() {
    const { setNodes } = useReactFlow();

    const deleteNode = (nodeId) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    };

    return deleteNode;
}

export function DeleteButton({ nodeId, onClick }) {
    const deleteNode = useDeleteNode();

    const handleClick = (e) => {
        e.stopPropagation();
        if (onClick) {
            onClick(nodeId);
        } else {
            deleteNode(nodeId);
        }
    };

    return (
        <button
            className="node-delete-btn"
            onClick={handleClick}
            title="Delete node"
        >
            ×
        </button>
    );
}
