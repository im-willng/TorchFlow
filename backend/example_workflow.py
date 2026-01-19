"""
Example: Build and test a simple MNIST classifier
This script demonstrates the complete workflow
"""

import json
from graph_parser import GraphParser
from code_generator import CodeGenerator


def create_mnist_classifier_graph():
    """Create a simple MNIST classifier graph"""
    return {
        'nodes': [
            {
                'id': 'input1',
                'type': 'input',
                'data': {'params': {'shape': [1, 1, 28, 28]}}
            },
            {
                'id': 'flatten1',
                'type': 'flatten',
                'data': {'params': {}}
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
                'id': 'dropout1',
                'type': 'dropout',
                'data': {'params': {'p': 0.2}}
            },
            {
                'id': 'linear2',
                'type': 'linear',
                'data': {'params': {'in_features': 128, 'out_features': 10}}
            }
        ],
        'edges': [
            {'source': 'input1', 'target': 'flatten1'},
            {'source': 'flatten1', 'target': 'linear1'},
            {'source': 'linear1', 'target': 'relu1'},
            {'source': 'relu1', 'target': 'dropout1'},
            {'source': 'dropout1', 'target': 'linear2'}
        ]
    }


def main():
    print("=" * 60)
    print("PyTorch GUI IDE - Example Workflow")
    print("=" * 60)
    print()
    
    # Step 1: Create graph
    print("Step 1: Creating MNIST classifier graph...")
    graph = create_mnist_classifier_graph()
    print(f"  ✓ Created graph with {len(graph['nodes'])} nodes")
    print()
    
    # Step 2: Validate graph
    print("Step 2: Validating graph...")
    parser = GraphParser()
    validation = parser.validate(graph)
    
    if validation['valid']:
        print("  ✓ Graph is valid!")
        print(f"  ✓ Total parameters: {validation['total_params']:,}")
    else:
        print("  ✗ Validation errors:")
        for error in validation['errors']:
            print(f"    - {error}")
        return
    print()
    
    # Step 3: Generate code
    print("Step 3: Generating PyTorch code...")
    generator = CodeGenerator()
    code = generator.generate(graph)
    print("  ✓ Code generated successfully!")
    print()
    
    # Step 4: Display generated code
    print("Step 4: Generated PyTorch Model:")
    print("-" * 60)
    print(code)
    print("-" * 60)
    print()
    
    # Step 5: Save code
    output_file = 'example_model.py'
    with open(output_file, 'w') as f:
        f.write(code)
    print(f"Step 5: Code saved to {output_file}")
    print()
    
    print("=" * 60)
    print("Example completed successfully!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("  1. Run the full application: npm run dev")
    print("  2. Build this model in the UI")
    print("  3. Train on MNIST dataset")
    print("  4. Export trained model")


if __name__ == '__main__':
    main()
