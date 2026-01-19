"""
Unit tests for code_generator module
"""

import pytest
from code_generator import CodeGenerator


def test_simple_linear_model():
    """Test code generation for simple linear model"""
    graph = {
        'nodes': [
            {
                'id': 'input1',
                'type': 'input',
                'data': {'params': {'shape': [1, 784]}}
            },
            {
                'id': 'linear1',
                'type': 'linear',
                'data': {'params': {'in_features': 784, 'out_features': 128}}
            },
            {
                'id': 'relu1',
                'type': 'relu',
                'data': {'params': {}}
            },
            {
                'id': 'linear2',
                'type': 'linear',
                'data': {'params': {'in_features': 128, 'out_features': 10}}
            }
        ],
        'edges': [
            {'source': 'input1', 'target': 'linear1'},
            {'source': 'linear1', 'target': 'relu1'},
            {'source': 'relu1', 'target': 'linear2'}
        ]
    }
    
    generator = CodeGenerator()
    code = generator.generate(graph)
    
    # Verify code structure
    assert 'import torch' in code
    assert 'class Model(nn.Module)' in code
    assert 'def __init__(self)' in code
    assert 'def forward(self, x)' in code
    assert 'nn.Linear(784, 128)' in code
    assert 'nn.Linear(128, 10)' in code
    assert 'F.relu(x)' in code


def test_cnn_model():
    """Test code generation for CNN model"""
    graph = {
        'nodes': [
            {
                'id': 'input1',
                'type': 'input',
                'data': {'params': {'shape': [1, 1, 28, 28]}}
            },
            {
                'id': 'conv1',
                'type': 'conv2d',
                'data': {'params': {
                    'in_channels': 1,
                    'out_channels': 32,
                    'kernel_size': 3,
                    'stride': 1,
                    'padding': 0
                }}
            },
            {
                'id': 'relu1',
                'type': 'relu',
                'data': {'params': {}}
            },
            {
                'id': 'flatten1',
                'type': 'flatten',
                'data': {'params': {}}
            }
        ],
        'edges': [
            {'source': 'input1', 'target': 'conv1'},
            {'source': 'conv1', 'target': 'relu1'},
            {'source': 'relu1', 'target': 'flatten1'}
        ]
    }
    
    generator = CodeGenerator()
    code = generator.generate(graph)
    
    assert 'nn.Conv2d(1, 32, kernel_size=3)' in code
    assert 'torch.flatten(x, 1)' in code


def test_generated_code_is_valid_python():
    """Test that generated code is valid Python"""
    graph = {
        'nodes': [
            {
                'id': 'input1',
                'type': 'input',
                'data': {'params': {'shape': [1, 784]}}
            },
            {
                'id': 'linear1',
                'type': 'linear',
                'data': {'params': {'in_features': 784, 'out_features': 10}}
            }
        ],
        'edges': [
            {'source': 'input1', 'target': 'linear1'}
        ]
    }
    
    generator = CodeGenerator()
    code = generator.generate(graph)
    
    # Try to compile the code
    try:
        compile(code, '<string>', 'exec')
        compiled = True
    except SyntaxError:
        compiled = False
    
    assert compiled == True


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
