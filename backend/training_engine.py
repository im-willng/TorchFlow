"""
Training Engine
Handles model training with MNIST dataset and real-time event streaming
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from typing import Dict, Any, Callable, Optional
import tempfile
import os


class TrainingEngine:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.stop_requested = False
        
    def train(
        self,
        code: str,
        config: Dict[str, Any],
        on_epoch_end: Optional[Callable] = None,
        on_batch_end: Optional[Callable] = None
    ):
        """
        Train model with given configuration
        
        Args:
            code: Generated PyTorch model code
            config: Training configuration
            on_epoch_end: Callback(epoch, loss, accuracy)
            on_batch_end: Callback(batch, total_batches, loss)
        
        Returns:
            (model, final_loss, final_accuracy)
        """
        # Load model from generated code
        model = self._load_model_from_code(code)
        model = model.to(self.device)
        
        # Setup optimizer
        optimizer_name = config.get('optimizer', 'adam').lower()
        lr = config.get('lr', 0.001)
        
        if optimizer_name == 'sgd':
            optimizer = optim.SGD(model.parameters(), lr=lr)
        elif optimizer_name == 'adam':
            optimizer = optim.Adam(model.parameters(), lr=lr)
        else:
            optimizer = optim.Adam(model.parameters(), lr=lr)
        
        # Loss function
        criterion = nn.CrossEntropyLoss()
        
        # Load MNIST dataset
        train_loader, test_loader = self._load_mnist_data(
            batch_size=config.get('batch_size', 64)
        )
        
        # Training loop
        epochs = config.get('epochs', 10)
        final_loss = 0.0
        final_accuracy = 0.0
        
        for epoch in range(1, epochs + 1):
            if self.stop_requested:
                break
            
            # Train
            train_loss = self._train_epoch(
                model, train_loader, optimizer, criterion,
                on_batch_end=on_batch_end
            )
            
            # Evaluate
            test_loss, accuracy = self._evaluate(model, test_loader, criterion)
            
            final_loss = test_loss
            final_accuracy = accuracy
            
            # Callback
            if on_epoch_end:
                on_epoch_end(epoch, test_loss, accuracy)
        
        self.model = model
        return model, final_loss, final_accuracy
    
    def _load_model_from_code(self, code: str):
        """Dynamically load model from generated code"""
        # Create temporary module
        namespace = {}
        exec(code, namespace)
        
        # Instantiate model
        Model = namespace['Model']
        model = Model()
        
        return model
    
    def _load_mnist_data(self, batch_size: int = 64):
        """Load MNIST dataset"""
        transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.1307,), (0.3081,))
        ])
        
        train_dataset = datasets.MNIST(
            root='./data',
            train=True,
            download=True,
            transform=transform
        )
        
        test_dataset = datasets.MNIST(
            root='./data',
            train=False,
            download=True,
            transform=transform
        )
        
        train_loader = DataLoader(
            train_dataset,
            batch_size=batch_size,
            shuffle=True
        )
        
        test_loader = DataLoader(
            test_dataset,
            batch_size=batch_size,
            shuffle=False
        )
        
        return train_loader, test_loader
    
    def _train_epoch(
        self,
        model,
        train_loader,
        optimizer,
        criterion,
        on_batch_end: Optional[Callable] = None
    ) -> float:
        """Train for one epoch"""
        model.train()
        total_loss = 0.0
        total_batches = len(train_loader)
        
        for batch_idx, (data, target) in enumerate(train_loader):
            if self.stop_requested:
                break
            
            data, target = data.to(self.device), target.to(self.device)
            
            optimizer.zero_grad()
            output = model(data)
            loss = criterion(output, target)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
            # Callback every 100 batches
            if on_batch_end and batch_idx % 100 == 0:
                on_batch_end(batch_idx, total_batches, loss.item())
        
        return total_loss / len(train_loader)
    
    def _evaluate(self, model, test_loader, criterion) -> tuple:
        """Evaluate model on test set"""
        model.eval()
        test_loss = 0.0
        correct = 0
        total = 0
        
        with torch.no_grad():
            for data, target in test_loader:
                data, target = data.to(self.device), target.to(self.device)
                output = model(data)
                
                test_loss += criterion(output, target).item()
                
                pred = output.argmax(dim=1, keepdim=True)
                correct += pred.eq(target.view_as(pred)).sum().item()
                total += target.size(0)
        
        test_loss /= len(test_loader)
        accuracy = correct / total
        
        return test_loss, accuracy
    
    def stop(self):
        """Request training stop"""
        self.stop_requested = True
