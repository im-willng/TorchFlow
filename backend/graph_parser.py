"""
Graph Parser and Validator
Validates graph structure, connections, and shape compatibility
"""

from typing import Dict, List, Any, Set
from schema import NodeType, NODE_SCHEMAS, infer_output_shape, validate_node_params


class GraphParser:
    def __init__(self):
        self.nodes = {}
        self.edges = []
        self.node_shapes = {}
        
    def validate(self, graph_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate entire graph
        
        Returns:
            {
                'valid': bool,
                'errors': List[str],
                'total_params': int
            }
        """
        errors = []
        
        # Parse nodes and edges
        nodes = graph_data.get('nodes', [])
        edges = graph_data.get('edges', [])
        
        if not nodes:
            return {'valid': False, 'errors': ['Graph has no nodes']}
        
        # Build node map
        self.nodes = {node['id']: node for node in nodes}
        self.edges = edges
        
        # Validate individual nodes
        for node in nodes:
            node_errors = self._validate_node(node)
            errors.extend(node_errors)
        
        # Check for input node
        input_nodes = [n for n in nodes if n['type'] == NodeType.INPUT.value]
        if not input_nodes:
            errors.append('Graph must have at least one Input node')
        elif len(input_nodes) > 1:
            errors.append('Graph can only have one Input node')
        
        # Validate connections
        connection_errors = self._validate_connections()
        errors.extend(connection_errors)
        
        # Check for cycles
        if self._has_cycle():
            errors.append('Graph contains cycles (must be DAG)')
        
        # Validate shapes
        if not errors:
            shape_errors = self._validate_shapes()
            errors.extend(shape_errors)
        
        # Calculate total parameters
        total_params = 0
        if not errors:
            total_params = self._calculate_total_params()
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'total_params': total_params
        }
    
    def _validate_node(self, node: Dict[str, Any]) -> List[str]:
        """Validate single node"""
        errors = []
        node_id = node.get('id')
        node_type_str = node.get('type')
        
        if not node_id:
            errors.append('Node missing id')
            return errors
        
        try:
            node_type = NodeType(node_type_str)
        except ValueError:
            errors.append(f'Node {node_id}: Invalid node type {node_type_str}')
            return errors
        
        # Validate parameters
        params = node.get('data', {}).get('params', {})
        param_errors = validate_node_params(node_type, params)
        for err in param_errors:
            errors.append(f'Node {node_id}: {err}')
        
        return errors
    
    def _validate_connections(self) -> List[str]:
        """Validate edge connections"""
        errors = []
        
        # Build adjacency list
        incoming = {node_id: [] for node_id in self.nodes}
        
        for edge in self.edges:
            source = edge.get('source')
            target = edge.get('target')
            
            if source not in self.nodes:
                errors.append(f'Edge references unknown source node: {source}')
                continue
            if target not in self.nodes:
                errors.append(f'Edge references unknown target node: {target}')
                continue
            
            incoming[target].append(source)
        
        # Check input/output counts
        for node_id, node in self.nodes.items():
            node_type = NodeType(node['type'])
            schema = NODE_SCHEMAS[node_type]
            
            # Check inputs
            expected_inputs = schema.get('inputs', 0)
            actual_inputs = len(incoming[node_id])
            
            if expected_inputs > 0 and actual_inputs == 0:
                errors.append(f'Node {node_id} ({node_type.value}) requires {expected_inputs} input(s)')
            elif expected_inputs > 0 and actual_inputs > expected_inputs:
                errors.append(f'Node {node_id} ({node_type.value}) has too many inputs')
        
        return errors
    
    def _has_cycle(self) -> bool:
        """Detect cycles using DFS"""
        visited = set()
        rec_stack = set()
        
        # Build adjacency list
        adj = {node_id: [] for node_id in self.nodes}
        for edge in self.edges:
            adj[edge['source']].append(edge['target'])
        
        def dfs(node_id):
            visited.add(node_id)
            rec_stack.add(node_id)
            
            for neighbor in adj[node_id]:
                if neighbor not in visited:
                    if dfs(neighbor):
                        return True
                elif neighbor in rec_stack:
                    return True
            
            rec_stack.remove(node_id)
            return False
        
        for node_id in self.nodes:
            if node_id not in visited:
                if dfs(node_id):
                    return True
        
        return False
    
    def _validate_shapes(self) -> List[str]:
        """Validate shape compatibility through the graph"""
        errors = []
        
        # Find input node
        input_node = None
        for node in self.nodes.values():
            if node['type'] == NodeType.INPUT.value:
                input_node = node
                break
        
        if not input_node:
            return errors
        
        # Topological sort
        sorted_nodes = self._topological_sort()
        if not sorted_nodes:
            return ['Cannot perform topological sort']
        
        # Propagate shapes
        self.node_shapes = {}
        
        for node_id in sorted_nodes:
            node = self.nodes[node_id]
            node_type = NodeType(node['type'])
            params = node.get('data', {}).get('params', {})
            
            if node_type == NodeType.INPUT:
                # Input node defines its own shape
                shape = params.get('shape', [])
                if not shape:
                    errors.append(f'Input node {node_id} missing shape')
                else:
                    self.node_shapes[node_id] = shape
            else:
                # Get input shape from predecessor
                predecessors = [e['source'] for e in self.edges if e['target'] == node_id]
                
                if not predecessors:
                    continue
                
                input_shape = self.node_shapes.get(predecessors[0])
                if not input_shape:
                    continue
                
                try:
                    output_shape = infer_output_shape(node_type, input_shape, params)
                    self.node_shapes[node_id] = output_shape
                except Exception as e:
                    errors.append(f'Node {node_id}: Shape inference failed - {str(e)}')
        
        return errors
    
    def _topological_sort(self) -> List[str]:
        """Return nodes in topological order"""
        # Build adjacency list
        adj = {node_id: [] for node_id in self.nodes}
        in_degree = {node_id: 0 for node_id in self.nodes}
        
        for edge in self.edges:
            adj[edge['source']].append(edge['target'])
            in_degree[edge['target']] += 1
        
        # Kahn's algorithm
        queue = [node_id for node_id, degree in in_degree.items() if degree == 0]
        result = []
        
        while queue:
            node_id = queue.pop(0)
            result.append(node_id)
            
            for neighbor in adj[node_id]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        if len(result) != len(self.nodes):
            return []
        
        return result
    
    def _calculate_total_params(self) -> int:
        """Calculate total trainable parameters"""
        total = 0
        
        for node_id, node in self.nodes.items():
            node_type = NodeType(node['type'])
            params = node.get('data', {}).get('params', {})
            
            if node_type == NodeType.LINEAR:
                in_f = params.get('in_features', 0)
                out_f = params.get('out_features', 0)
                total += in_f * out_f + out_f  # weights + bias
            
            elif node_type == NodeType.CONV2D:
                in_c = params.get('in_channels', 0)
                out_c = params.get('out_channels', 0)
                k = params.get('kernel_size', 0)
                total += in_c * out_c * k * k + out_c  # weights + bias
            
            elif node_type == NodeType.BATCHNORM:
                num_f = params.get('num_features', 0)
                total += num_f * 2  # gamma + beta
        
        return total
    
    def get_execution_order(self) -> List[str]:
        """Get nodes in execution order"""
        return self._topological_sort()
