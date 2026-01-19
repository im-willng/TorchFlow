"""
Graph Schema Definitions
Defines node types, parameters, and validation rules
"""

from enum import Enum
from typing import Dict, List, Any, Optional


class NodeType(Enum):
    INPUT = "input"
    LINEAR = "linear"
    CONV2D = "conv2d"
    RELU = "relu"
    BATCHNORM = "batchnorm"
    DROPOUT = "dropout"
    FLATTEN = "flatten"
    SOFTMAX = "softmax"


# Parameter schemas for each node type
NODE_SCHEMAS = {
    NodeType.INPUT: {
        'params': ['shape'],
        'required': ['shape'],
        'outputs': 1
    },
    NodeType.LINEAR: {
        'params': ['in_features', 'out_features'],
        'required': ['in_features', 'out_features'],
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
    NodeType.RELU: {
        'params': [],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.BATCHNORM: {
        'params': ['num_features'],
        'required': ['num_features'],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.DROPOUT: {
        'params': ['p'],
        'required': ['p'],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.FLATTEN: {
        'params': [],
        'inputs': 1,
        'outputs': 1
    },
    NodeType.SOFTMAX: {
        'params': ['dim'],
        'defaults': {'dim': 1},
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
    
    elif node_type == NodeType.BATCHNORM:
        # Shape unchanged
        return input_shape
    
    elif node_type in [NodeType.RELU, NodeType.DROPOUT, NodeType.SOFTMAX]:
        # Shape unchanged
        return input_shape
    
    else:
        raise ValueError(f"Unknown node type: {node_type}")


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
