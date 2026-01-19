"""
Graph Schema Definitions
Defines node types, parameters, and validation rules
"""

from enum import Enum
from typing import Dict, List, Any, Optional


class NodeType(Enum):
    # Input/Output
    INPUT = "input"
    OUTPUT = "output"
    
    # Convolutional
    CONV1D = "conv1d"
    CONV2D = "conv2d"
    CONV3D = "conv3d"
    CONVTRANSPOSE2D = "convtranspose2d"
    MAXPOOL2D = "maxpool2d"
    AVGPOOL2D = "avgpool2d"
    ADAPTIVEAVGPOOL2D = "adaptiveavgpool2d"
    
    # Fully Connected
    LINEAR = "linear"
    FLATTEN = "flatten"
    
    # Recurrent
    LSTM = "lstm"
    GRU = "gru"
    RNN = "rnn"
    
    # Normalization
    BATCHNORM = "batchnorm"
    LAYERNORM = "layernorm"
    GROUPNORM = "groupnorm"
    INSTANCENORM = "instancenorm"
    
    # Activation
    RELU = "relu"
    LEAKYRELU = "leakyrelu"
    SIGMOID = "sigmoid"
    TANH = "tanh"
    GELU = "gelu"
    ELU = "elu"
    SILU = "silu"
    SOFTMAX = "softmax"
    
    # Utility
    DROPOUT = "dropout"
    RESHAPE = "reshape"
    CONCATENATE = "concatenate"
    ADD = "add"
    MULTIPLY = "multiply"
    EMBEDDING = "embedding"
    
    # Attention
    MULTIHEADATTENTION = "multiheadattention"


# Parameter schemas for each node type
NODE_SCHEMAS = {
    # Input/Output
    NodeType.INPUT: {
        'params': ['shape'],
        'required': ['shape'],
        'outputs': 1
    },
    NodeType. OUTPUT: {
        'params': ['outputType', 'numClasses'],
        'required': [],
        'defaults': {'outputType': 'classification', 'numClasses': 10},
        'inputs': 1
    },
    
    # Convolutional
    NodeType.CONV1D: {
        'params': ['in_channels', 'out_channels', 'kernel_size', 'stride', 'padding'],
        'required': ['in_channels', 'out_channels', 'kernel_size'],
        'defaults': {'stride': 1, 'padding': 0},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.CONV2D: {
        'params': ['in_channels', 'out_channels', 'kernel_size', 'stride', 'padding'],
        'required': ['in_channels', 'out_channels', 'kernel_size'],
        'defaults': {'stride': 1, 'padding': 0},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.CONV3D: {
        'params': ['in_channels', 'out_channels', 'kernel_size', 'stride', 'padding'],
        'required': ['in_channels', 'out_channels', 'kernel_size'],
        'defaults': {'stride': 1, 'padding': 0},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.CONVTRANSPOSE2D: {
        'params': ['in_channels', 'out_channels', 'kernel_size', 'stride', 'padding'],
        'required': ['in_channels', 'out_channels', 'kernel_size'],
        'defaults': {'stride': 2, 'padding': 1},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.MAXPOOL2D: {
        'params': ['kernel_size', 'stride', 'padding'],
        'required': ['kernel_size'],
        'defaults': {'stride': 2, 'padding': 0},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.AVGPOOL2D: {
        'params': ['kernel_size', 'stride', 'padding'],
        'required': ['kernel_size'],
        'defaults': {'stride': 2, 'padding': 0},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.ADAPTIVEAVGPOOL2D: {
        'params': ['output_size'],
        'required': ['output_size'],
        'defaults': {'output_size': 1},
        'inputs': 1,
        'outputs': 1
    },
    
    # Fully Connected
    NodeType.LINEAR: {
        'params': ['in_features', 'out_features'],
        'required': ['in_features', 'out_features'],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.FLATTEN: {
        'params': [],
        'inputs': 1,
        'outputs': 1
    },
    
    # Recurrent
    NodeType.LSTM: {
        'params': ['input_size', 'hidden_size', 'num_layers', 'bidirectional'],
        'required': ['input_size', 'hidden_size'],
        'defaults': {'num_layers': 1, 'bidirectional': False},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.GRU: {
        'params': ['input_size', 'hidden_size', 'num_layers', 'bidirectional'],
        'required': ['input_size', 'hidden_size'],
        'defaults': {'num_layers': 1, 'bidirectional': False},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.RNN: {
        'params': ['input_size', 'hidden_size', 'num_layers'],
        'required': ['input_size', 'hidden_size'],
        'defaults': {'num_layers': 1},
        'inputs': 1,
        'outputs': 1
    },
    
    # Normalization
    NodeType.BATCHNORM: {
        'params': ['num_features'],
        'required': ['num_features'],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.LAYERNORM: {
        'params': ['normalized_shape'],
        'required': ['normalized_shape'],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.GROUPNORM: {
        'params': ['num_groups', 'num_channels'],
        'required': ['num_groups', 'num_channels'],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.INSTANCENORM: {
        'params': ['num_features'],
        'required': ['num_features'],
        'inputs': 1,
        'outputs': 1
    },
    
    # Activation
    NodeType.RELU: {
        'params': [],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.LEAKYRELU: {
        'params': ['negative_slope'],
        'defaults': {'negative_slope': 0.01},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.SIGMOID: {
        'params': [],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.TANH: {
        'params': [],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.GELU: {
        'params': [],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.ELU: {
        'params': ['alpha'],
        'defaults': {'alpha': 1.0},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.SILU: {
        'params': [],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.SOFTMAX: {
        'params': ['dim'],
        'defaults': {'dim': 1},
        'inputs': 1,
        'outputs': 1
    },
    
    # Utility
    NodeType.DROPOUT: {
        'params': ['p'],
        'required': [],
        'defaults': {'p': 0.5},
        'inputs': 1,
        'outputs': 1
    },
    NodeType.RESHAPE: {
        'params': ['target_shape'],
        'required': ['target_shape'],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.CONCATENATE: {
        'params': ['dim'],
        'defaults': {'dim': 1},
        'inputs': -1,  # Multiple inputs
        'outputs': 1
    },
    NodeType.ADD: {
        'params': [],
        'inputs': -1,  # Multiple inputs
        'outputs': 1
    },
    NodeType.MULTIPLY: {
        'params': [],
        'inputs': -1,  # Multiple inputs
        'outputs': 1
    },
    NodeType.EMBEDDING: {
        'params': ['num_embeddings', 'embedding_dim'],
        'required': ['num_embeddings', 'embedding_dim'],
        'inputs': 1,
        'outputs': 1
    },
    
    # Attention
    NodeType.MULTIHEADATTENTION: {
        'params': ['embed_dim', 'num_heads'],
        'required': ['embed_dim', 'num_heads'],
        'inputs': 1,
        'outputs': 1
    }
}


def infer_output_shape(node_type: NodeType, input_shape: List[int], params: Dict[str, Any]) -> List[int]:
    """
    Infer output shape based on node type and parameters
    
    Args:
        node_type: Type of the node
        input_shape: Input tensor shape [batch, ...]
        params: Node parameters
    
    Returns:
        Output tensor shape
    """
    if node_type == NodeType.INPUT:
        return params['shape']
    
    elif node_type == NodeType.LINEAR:
        # [batch, in_features] -> [batch, out_features]
        return [input_shape[0], params['out_features']]
    
    elif node_type == NodeType.CONV2D:
        # [batch, in_channels, H, W] -> [batch, out_channels, H', W']
        batch, _, h, w = input_shape
        kernel = params['kernel_size']
        stride = params.get('stride', 1)
        padding = params.get('padding', 0)
        
        h_out = (h + 2 * padding - kernel) // stride + 1
        w_out = (w + 2 * padding - kernel) // stride + 1
        
        return [batch, params['out_channels'], h_out, w_out]
    
    elif node_type == NodeType.FLATTEN:
        # [batch, ...] -> [batch, product of rest]
        batch = input_shape[0]
        flat_size = 1
        for dim in input_shape[1:]:
            flat_size *= dim
        return [batch, flat_size]
    
    # All other nodes preserve shape (simplified for now)
    else:
        return input_shape


def validate_node_params(node_type: NodeType, params: Dict[str, Any]) -> List[str]:
    """
    Validate node parameters against schema
    
    Returns:
        List of error messages (empty if valid)
    """
    errors = []
    schema = NODE_SCHEMAS.get(node_type)
    
    if not schema:
        return [f"Unknown node type: {node_type}"]
    
    # Check required parameters
    required = schema.get('required', [])
    for param in required:
        if param not in params or params[param] is None:
            errors.append(f"Missing required parameter: {param}")
    
    # Validate parameter values
    if node_type == NodeType.LINEAR:
        if 'in_features' in params and params['in_features'] <= 0:
            errors.append("in_features must be positive")
        if 'out_features' in params and params['out_features'] <= 0:
            errors.append("out_features must be positive")
    
    elif node_type == NodeType.CONV2D:
        if 'in_channels' in params and params['in_channels'] <= 0:
            errors.append("in_channels must be positive")
        if 'out_channels' in params and params['out_channels'] <= 0:
            errors.append("out_channels must be positive")
        if 'kernel_size' in params and params['kernel_size'] <= 0:
            errors.append("kernel_size must be positive")
    
    elif node_type == NodeType.DROPOUT:
        if 'p' in params and not (0 <= params['p'] < 1):
            errors.append("dropout probability must be in [0, 1)")
    
    return errors
