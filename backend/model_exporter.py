"""
Model Exporter
Exports trained model code and weights
"""

import torch
import json
import os
from typing import Dict, Any


class ModelExporter:
    def export(
        self,
        model,
        graph_data: Dict[str, Any],
        config: Dict[str, Any],
        path: str = './exports'
    ) -> Dict[str, str]:
        """
        Export model, graph data and config
        
        Returns:
            Dictionary with exported file paths
        """
        # Create export directory
        os.makedirs(path, exist_ok=True)
        
        # Export graph data
        graph_path = os.path.join(path, 'graph.json')
        with open(graph_path, 'w') as f:
            json.dump(graph_data, f, indent=2)
        
        # Export weights
        weights_path = os.path.join(path, 'model.pt')
        torch.save(model.state_dict(), weights_path)
        
        # Export config
        config_path = os.path.join(path, 'config.json')
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        # Export metadata
        metadata_path = os.path.join(path, 'metadata.txt')
        with open(metadata_path, 'w') as f:
            f.write("PyTorch Model Export\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Optimizer: {config.get('optimizer', 'adam')}\n")
            f.write(f"Learning Rate: {config.get('lr', 0.001)}\n")
            f.write(f"Epochs: {config.get('epochs', 10)}\n")
            f.write(f"Batch Size: {config.get('batch_size', 64)}\n")
            f.write(f"Total Nodes: {len(graph_data.get('nodes', []))}\n")
            f.write(f"Total Connections: {len(graph_data.get('edges', []))}\n")
        
        return {
            'graph': graph_path,
            'weights': weights_path,
            'config': config_path,
            'metadata': metadata_path
        }
