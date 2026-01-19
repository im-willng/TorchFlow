import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
} from 'react-flow-renderer';
import NodePalette from './NodePalette';
import InputNode from './nodes/InputNode';
import LinearNode from './nodes/LinearNode';
import Conv2DNode from './nodes/Conv2DNode';
import Conv1DNode from './nodes/Conv1DNode';
import Conv3DNode from './nodes/Conv3DNode';
import ConvTranspose2DNode from './nodes/ConvTranspose2DNode';
import MaxPool2DNode from './nodes/MaxPool2DNode';
import AvgPool2DNode from './nodes/AvgPool2DNode';
import AdaptiveAvgPool2DNode from './nodes/AdaptiveAvgPool2DNode';
import ActivationNode from './nodes/ActivationNode';
import LeakyReLUNode from './nodes/LeakyReLUNode';
import SigmoidNode from './nodes/SigmoidNode';
import TanhNode from './nodes/TanhNode';
import GELUNode from './nodes/GELUNode';
import ELUNode from './nodes/ELUNode';
import SiLUNode from './nodes/SiLUNode';
import NormNode from './nodes/NormNode';
import LayerNormNode from './nodes/LayerNormNode';
import GroupNormNode from './nodes/GroupNormNode';
import InstanceNormNode from './nodes/InstanceNormNode';
import DropoutNode from './nodes/DropoutNode';
import FlattenNode from './nodes/FlattenNode';
import LSTMNode from './nodes/LSTMNode';
import GRUNode from './nodes/GRUNode';
import RNNNode from './nodes/RNNNode';
import ReshapeNode from './nodes/ReshapeNode';
import ConcatenateNode from './nodes/ConcatenateNode';
import AddNode from './nodes/AddNode';
import MultiplyNode from './nodes/MultiplyNode';
import EmbeddingNode from './nodes/EmbeddingNode';
import MultiheadAttentionNode from './nodes/MultiheadAttentionNode';
import './NodeEditor.css';

const nodeTypes = {
    input: InputNode,
    linear: LinearNode,
    conv1d: Conv1DNode,
    conv2d: Conv2DNode,
    conv3d: Conv3DNode,
    convtranspose2d: ConvTranspose2DNode,
    maxpool2d: MaxPool2DNode,
    avgpool2d: AvgPool2DNode,
    adaptiveavgpool2d: AdaptiveAvgPool2DNode,
    relu: ActivationNode,
    leakyrelu: LeakyReLUNode,
    sigmoid: SigmoidNode,
    tanh: TanhNode,
    gelu: GELUNode,
    elu: ELUNode,
    silu: SiLUNode,
    softmax: ActivationNode,
    batchnorm: NormNode,
    layernorm: LayerNormNode,
    groupnorm: GroupNormNode,
    instancenorm: InstanceNormNode,
    dropout: DropoutNode,
    flatten: FlattenNode,
    lstm: LSTMNode,
    gru: GRUNode,
    rnn: RNNNode,
    reshape: ReshapeNode,
    concatenate: ConcatenateNode,
    add: AddNode,
    multiply: MultiplyNode,
    embedding: EmbeddingNode,
    multiheadattention: MultiheadAttentionNode,
};

function NodeEditor({ nodes, edges, onNodesChange, onEdgesChange }) {
    const [localNodes, setLocalNodes, onNodesChangeInternal] = useNodesState(nodes);
    const [localEdges, setLocalEdges, onEdgesChangeInternal] = useEdgesState(edges);

    const onConnect = useCallback((params) => {
        const newEdges = addEdge(params, localEdges);
        setLocalEdges(newEdges);
        onEdgesChange(newEdges);
    }, [localEdges, setLocalEdges, onEdgesChange]);

    const onNodeDrop = useCallback((nodeType, position) => {
        const newNode = {
            id: `${nodeType}-${Date.now()}`,
            type: nodeType,
            position,
            data: {
                label: nodeType.toUpperCase(),
                params: getDefaultParams(nodeType)
            }
        };

        const newNodes = [...localNodes, newNode];
        setLocalNodes(newNodes);
        onNodesChange(newNodes);
    }, [localNodes, setLocalNodes, onNodesChange]);

    const handleNodesChange = useCallback((changes) => {
        onNodesChangeInternal(changes);
        onNodesChange(localNodes);
    }, [onNodesChangeInternal, localNodes, onNodesChange]);

    const handleEdgesChange = useCallback((changes) => {
        onEdgesChangeInternal(changes);
        onEdgesChange(localEdges);
    }, [onEdgesChangeInternal, localEdges, onEdgesChange]);

    return (
        <div className="node-editor">
            <NodePalette onNodeDrop={onNodeDrop} />
            <ReactFlow
                nodes={localNodes}
                edges={localEdges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#2a2a2a" gap={16} />
                <Controls />
                <MiniMap
                    nodeColor="#4a90e2"
                    maskColor="rgba(0, 0, 0, 0.6)"
                />
            </ReactFlow>
        </div>
    );
}

function getDefaultParams(nodeType) {
    switch (nodeType) {
        case 'input':
            return { shape: [1, 28, 28] };
        case 'linear':
            return { in_features: 784, out_features: 128 };
        case 'conv1d':
            return { in_channels: 1, out_channels: 32, kernel_size: 3, stride: 1, padding: 0 };
        case 'conv2d':
            return { in_channels: 1, out_channels: 32, kernel_size: 3, stride: 1, padding: 0 };
        case 'conv3d':
            return { in_channels: 1, out_channels: 32, kernel_size: 3, stride: 1, padding: 0 };
        case 'convtranspose2d':
            return { in_channels: 32, out_channels: 16, kernel_size: 3, stride: 2, padding: 1 };
        case 'maxpool2d':
            return { kernel_size: 2, stride: 2, padding: 0 };
        case 'avgpool2d':
            return { kernel_size: 2, stride: 2, padding: 0 };
        case 'adaptiveavgpool2d':
            return { output_size: 1 };
        case 'batchnorm':
            return { num_features: 128 };
        case 'layernorm':
            return { normalized_shape: 128 };
        case 'groupnorm':
            return { num_groups: 32, num_channels: 128 };
        case 'instancenorm':
            return { num_features: 128 };
        case 'dropout':
            return { p: 0.5 };
        case 'leakyrelu':
            return { negative_slope: 0.01 };
        case 'elu':
            return { alpha: 1.0 };
        case 'softmax':
            return { dim: 1 };
        case 'lstm':
            return { input_size: 128, hidden_size: 256, num_layers: 1, bidirectional: false };
        case 'gru':
            return { input_size: 128, hidden_size: 256, num_layers: 1, bidirectional: false };
        case 'rnn':
            return { input_size: 128, hidden_size: 256, num_layers: 1 };
        case 'reshape':
            return { target_shape: '-1, 784' };
        case 'concatenate':
            return { dim: 1 };
        case 'embedding':
            return { num_embeddings: 10000, embedding_dim: 128 };
        case 'multiheadattention':
            return { embed_dim: 512, num_heads: 8 };
        default:
            return {};
    }
}

export default NodeEditor;
