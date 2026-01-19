"""
Model Exporter
Exports trained model code and weights
"""

import torch
import os
from typing import Dict, Any


class ModelExporter:
    def export(
        self,
        model,
        code: str,
        config: Dict[str, Any],
        path: str = './exports'
    ) -> Dict[str, str]:
        """
        Export model and code
        
        Returns:
            Dictionary with exported file paths
        """
        # Create export directory
        os.makedirs(path, exist_ok=True)
        
        # Export code
        code_path = os.path.join(path, 'model.py')
        with open(code_path, 'w') as f:
            f.write(code)
        
        # Export weights
        weights_path = os.path.join(path, 'model.pt')
        torch.save(model.state_dict(), weights_path)
        
        # Export metadata
        metadata_path = os.path.join(path, 'metadata.txt')
        with open(metadata_path, 'w') as f:
            f.write("PyTorch Model Export\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Optimizer: {config.get('optimizer', 'adam')}\n")
            f.write(f"Learning Rate: {config.get('lr', 0.001)}\n")
            f.write(f"Epochs: {config.get('epochs', 10)}\n")
            f.write(f"Batch Size: {config.get('batch_size', 64)}\n")
        
        return {
            'code': code_path,
            'weights': weights_path,
            'metadata': metadata_path
        }
