"""
Model Builder
Dynamically builds PyTorch models from graph data structure
"""

import torch
import torch.nn as nn
from typing import Dict, List, Any
from schema import NodeType


class ModelBuilder:
    """Build PyTorch models from graph definition"""
    
    def __init__(self):
        self.layer_map = {
            # Convolutional
            NodeType.CONV1D: self._build_conv1d,
            NodeType.CONV2D: self._build_conv2d,
            NodeType.CONV3D: self._build_conv3d,
            NodeType.CONVTRANSPOSE2D: self._build_convtranspose2d,
            NodeType.MAXPOOL2D: self._build_maxpool2d,
            NodeType.AVGPOOL2D: self._build_avgpool2d,
            NodeType.ADAPTIVEAVGPOOL2D: self._build_adaptiveavgpool2d,
            
            # Fully Connected
            NodeType.LINEAR: self._build_linear,
            NodeType.FLATTEN: self._build_flatten,
            
            # Recurrent
            NodeType.LSTM: self._build_lstm,
            NodeType.GRU: self._build_gru,
            NodeType.RNN: self._build_rnn,
            
            # Normalization
            NodeType.BATCHNORM: self._build_batchnorm,
            NodeType.LAYERNORM: self._build_layernorm,
            NodeType.GROUPNORM: self._build_groupnorm,
            NodeType.INSTANCENORM: self._build_instancenorm,
            
            # Activation
            NodeType.RELU: lambda p: nn.ReLU(),
            NodeType.LEAKYRELU: lambda p: nn.LeakyReLU(p.get('negative_slope', 0.01)),
            NodeType.SIGMOID: lambda p: nn.Sigmoid(),
            NodeType.TANH: lambda p: nn.Tanh(),
            NodeType.GELU: lambda p: nn.GELU(),
            NodeType.ELU: lambda p: nn.ELU(p.get('alpha', 1.0)),
            NodeType.SILU: lambda p: nn.SiLU(),
            NodeType.SOFTMAX: lambda p: nn.Softmax(dim=p.get('dim', 1)),
            
            # Utility
            NodeType.DROPOUT: lambda p: nn.Dropout(p.get('p', 0.5)),
            NodeType.EMBEDDING: lambda p: nn.Embedding(p['num_embeddings'], p['embedding_dim']),
            
            # Attention
            NodeType.MULTIHEADATTENTION: self._build_multihead_attention,
        }
    
    def build_model(self, graph_data: Dict[str, Any]) -> nn.Module:
        """Build PyTorch model from graph data"""
        nodes = graph_data.get('nodes', [])
        edges = graph_data.get('edges', [])
        
        # Build layers
        modules = []
        node_map = {}
        
        for node in nodes:
            node_id = node['id']
            node_type = NodeType(node['type'])
            params = node.get('params', {})
            
            # Skip input/output nodes
            if node_type in [NodeType.INPUT, NodeType.OUTPUT]:
                node_map[node_id] = None
                continue
            
            # Build layer
            if node_type in self.layer_map:
                layer = self.layer_map[node_type](params)
                modules.append(layer)
                node_map[node_id] = layer
        
        # Create sequential model
        model = nn.Sequential(*modules)
        return model
    
    # Layer builders
    def _build_conv1d(self, params):
        return nn.Conv1d(
            params['in_channels'],
            params['out_channels'],
            params['kernel_size'],
            stride=params.get('stride', 1),
            padding=params.get('padding', 0)
        )
    
    def _build_conv2d(self, params):
        return nn.Conv2d(
            params['in_channels'],
            params['out_channels'],
            params['kernel_size'],
            stride=params.get('stride', 1),
            padding=params.get('padding', 0)
        )
    
    def _build_conv3d(self, params):
        return nn.Conv3d(
            params['in_channels'],
            params['out_channels'],
            params['kernel_size'],
            stride=params.get('stride', 1),
            padding=params.get('padding', 0)
        )
    
    def _build_convtranspose2d(self, params):
        return nn.ConvTranspose2d(
            params['in_channels'],
            params['out_channels'],
            params['kernel_size'],
            stride=params.get('stride', 2),
            padding=params.get('padding', 1)
        )
    
    def _build_maxpool2d(self, params):
        return nn.MaxPool2d(
            params['kernel_size'],
            stride=params.get('stride', 2),
            padding=params.get('padding', 0)
        )
    
    def _build_avgpool2d(self, params):
        return nn.AvgPool2d(
            params['kernel_size'],
            stride=params.get('stride', 2),
            padding=params.get('padding', 0)
        )
    
    def _build_adaptiveavgpool2d(self, params):
        return nn.AdaptiveAvgPool2d(params.get('output_size', 1))
    
    def _build_linear(self, params):
        return nn.Linear(params['in_features'], params['out_features'])
    
    def _build_flatten(self, params):
        return nn.Flatten()
    
    def _build_lstm(self, params):
        return nn.LSTM(
            params['input_size'],
            params['hidden_size'],
            num_layers=params.get('num_layers', 1),
            bidirectional=params.get('bidirectional', False),
            batch_first=True
        )
    
    def _build_gru(self, params):
        return nn.GRU(
            params['input_size'],
            params['hidden_size'],
            num_layers=params.get('num_layers', 1),
            bidirectional=params.get('bidirectional', False),
            batch_first=True
        )
    
    def _build_rnn(self, params):
        return nn.RNN(
            params['input_size'],
            params['hidden_size'],
            num_layers=params.get('num_layers', 1),
            batch_first=True
        )
    
    def _build_batchnorm(self, params):
        return nn.BatchNorm1d(params['num_features'])
    
    def _build_layernorm(self, params):
        return nn.LayerNorm(params['normalized_shape'])
    
    def _build_groupnorm(self, params):
        return nn.GroupNorm(params['num_groups'], params['num_channels'])
    
    def _build_instancenorm(self, params):
        return nn.InstanceNorm1d(params['num_features'])
    
    def _build_multihead_attention(self, params):
        return nn.MultiheadAttention(
            params['embed_dim'],
            params['num_heads'],
            batch_first=True
        )
