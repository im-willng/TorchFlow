"""
Unit tests for graph_parser module
"""

import pytest
from graph_parser import GraphParser
from schema import NodeType


def test_valid_simple_graph():
    """Test validation of a simple valid graph"""
    graph = {
        'nodes': [
            {
                'id': 'input1',
                'type': 'input',
                'data': {'params': {'shape': [1, 28, 28]}}
            },
            {
                'id': 'flatten1',
                'type': 'flatten',
                'data': {'params': {}}
            },
            {
                'id': 'linear1',
                'type': 'linear',
                'data': {'params': {'in_features': 784, 'out_features': 10}}
            }
        ],
        'edges': [
            {'source': 'input1', 'target': 'flatten1'},
            {'source': 'flatten1', 'target': 'linear1'}
        ]
    }
    
    parser = GraphParser()
    result = parser.validate(graph)
    
    assert result['valid'] == True
    assert len(result['errors']) == 0
    assert result['total_params'] > 0


def test_missing_input_node():
    """Test graph without input node"""
    graph = {
        'nodes': [
            {
                'id': 'linear1',
                'type': 'linear',
                'data': {'params': {'in_features': 784, 'out_features': 10}}
            }
        ],
        'edges': []
    }
    
    parser = GraphParser()
    result = parser.validate(graph)
    
    assert result['valid'] == False
    assert any('Input node' in err for err in result['errors'])


def test_cycle_detection():
    """Test detection of cycles in graph"""
    graph = {
        'nodes': [
            {
                'id': 'input1',
                'type': 'input',
                'data': {'params': {'shape': [1, 28, 28]}}
            },
            {
                'id': 'linear1',
                'type': 'linear',
                'data': {'params': {'in_features': 784, 'out_features': 128}}
            },
            {
                'id': 'linear2',
                'type': 'linear',
                'data': {'params': {'in_features': 128, 'out_features': 784}}
            }
        ],
        'edges': [
            {'source': 'input1', 'target': 'linear1'},
            {'source': 'linear1', 'target': 'linear2'},
            {'source': 'linear2', 'target': 'linear1'}  # Creates cycle
        ]
    }
    
    parser = GraphParser()
    result = parser.validate(graph)
    
    assert result['valid'] == False
    assert any('cycle' in err.lower() for err in result['errors'])


def test_invalid_node_params():
    """Test validation of invalid node parameters"""
    graph = {
        'nodes': [
            {
                'id': 'input1',
                'type': 'input',
                'data': {'params': {'shape': [1, 28, 28]}}
            },
            {
                'id': 'linear1',
                'type': 'linear',
                'data': {'params': {'in_features': -10, 'out_features': 10}}  # Invalid
            }
        ],
        'edges': [
            {'source': 'input1', 'target': 'linear1'}
        ]
    }
    
    parser = GraphParser()
    result = parser.validate(graph)
    
    assert result['valid'] == False


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
