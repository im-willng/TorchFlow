"""
PyTorch Code Generator
Converts graph JSON to clean, readable PyTorch code
"""

from typing import Dict, List, Any
from schema import NodeType
from graph_parser import GraphParser


class CodeGenerator:
    def __init__(self):
        self.parser = GraphParser()
        
    def generate(self, graph_data: Dict[str, Any]) -> str:
        """
        Generate PyTorch model code from graph
        
        Returns:
            Python code as string
        """
        # Validate graph first
        validation = self.parser.validate(graph_data)
        if not validation['valid']:
            raise ValueError(f"Invalid graph: {validation['errors']}")
        
        # Get execution order
        execution_order = self.parser.get_execution_order()
        
        # Generate code sections
        imports = self._generate_imports()
        class_def = self._generate_class_definition(execution_order)
        
        return f"{imports}\n\n{class_def}"
    
    def _generate_imports(self) -> str:
        """Generate import statements"""
        return """import torch
import torch.nn as nn
import torch.nn.functional as F"""
    
    def _generate_class_definition(self, execution_order: List[str]) -> str:
        """Generate complete model class"""
        init_method = self._generate_init(execution_order)
        forward_method = self._generate_forward(execution_order)
        
        return f"""class Model(nn.Module):
    def __init__(self):
        super(Model, self).__init__()
{init_method}
    
    def forward(self, x):
{forward_method}
        return x"""
    
    def _generate_init(self, execution_order: List[str]) -> str:
        """Generate __init__ method"""
        lines = []
        layer_counter = {}
        
        for node_id in execution_order:
            node = self.parser.nodes[node_id]
            node_type = NodeType(node['type'])
            
            # Skip non-layer nodes
            if node_type in [NodeType.INPUT, NodeType.RELU, NodeType.FLATTEN, NodeType.SOFTMAX]:
                continue
            
            params = node.get('data', {}).get('params', {})
            
            # Generate unique layer name
            type_name = node_type.value
            if type_name not in layer_counter:
                layer_counter[type_name] = 0
            layer_counter[type_name] += 1
            layer_name = f"{type_name}{layer_counter[type_name]}"
            
            # Store layer name for forward pass
            node['layer_name'] = layer_name
            
            # Generate layer initialization
            if node_type == NodeType.LINEAR:
                in_f = params['in_features']
                out_f = params['out_features']
                lines.append(f"        self.{layer_name} = nn.Linear({in_f}, {out_f})")
            
            elif node_type == NodeType.CONV2D:
                in_c = params['in_channels']
                out_c = params['out_channels']
                k = params['kernel_size']
                s = params.get('stride', 1)
                p = params.get('padding', 0)
                
                if s == 1 and p == 0:
                    lines.append(f"        self.{layer_name} = nn.Conv2d({in_c}, {out_c}, kernel_size={k})")
                else:
                    lines.append(f"        self.{layer_name} = nn.Conv2d({in_c}, {out_c}, kernel_size={k}, stride={s}, padding={p})")
            
            elif node_type == NodeType.BATCHNORM:
                num_f = params['num_features']
                lines.append(f"        self.{layer_name} = nn.BatchNorm1d({num_f})")
            
            elif node_type == NodeType.DROPOUT:
                p = params['p']
                lines.append(f"        self.{layer_name} = nn.Dropout(p={p})")
        
        return '\n'.join(lines) if lines else "        pass"
    
    def _generate_forward(self, execution_order: List[str]) -> str:
        """Generate forward method"""
        lines = []
        
        for node_id in execution_order:
            node = self.parser.nodes[node_id]
            node_type = NodeType(node['type'])
            
            if node_type == NodeType.INPUT:
                continue
            
            elif node_type == NodeType.LINEAR:
                layer_name = node.get('layer_name')
                lines.append(f"        x = self.{layer_name}(x)")
            
            elif node_type == NodeType.CONV2D:
                layer_name = node.get('layer_name')
                lines.append(f"        x = self.{layer_name}(x)")
            
            elif node_type == NodeType.RELU:
                lines.append(f"        x = F.relu(x)")
            
            elif node_type == NodeType.BATCHNORM:
                layer_name = node.get('layer_name')
                lines.append(f"        x = self.{layer_name}(x)")
            
            elif node_type == NodeType.DROPOUT:
                layer_name = node.get('layer_name')
                lines.append(f"        x = self.{layer_name}(x)")
            
            elif node_type == NodeType.FLATTEN:
                lines.append(f"        x = torch.flatten(x, 1)")
            
            elif node_type == NodeType.SOFTMAX:
                params = node.get('data', {}).get('params', {})
                dim = params.get('dim', 1)
                lines.append(f"        x = F.softmax(x, dim={dim})")
        
        return '\n'.join(lines) if lines else "        pass"
