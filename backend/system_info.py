"""
System Information Module
Get hardware configuration details (CPU, RAM, GPU, etc.)
"""

import platform
import psutil
import torch
from typing import Dict, Any


def get_cpu_info() -> Dict[str, Any]:
    """Get CPU information"""
    return {
        'processor': platform.processor(),
        'architecture': platform.machine(),
        'cores_physical': psutil.cpu_count(logical=False),
        'cores_logical': psutil.cpu_count(logical=True),
        'frequency_mhz': psutil.cpu_freq().current if psutil.cpu_freq() else 0,
        'frequency_max_mhz': psutil.cpu_freq().max if psutil.cpu_freq() else 0,
        'usage_percent': psutil.cpu_percent(interval=1)
    }


def get_memory_info() -> Dict[str, Any]:
    """Get memory (RAM) information"""
    memory = psutil.virtual_memory()
    return {
        'total_gb': round(memory.total / (1024**3), 2),
        'available_gb': round(memory.available / (1024**3), 2),
        'used_gb': round(memory.used / (1024**3), 2),
        'percent': memory.percent
    }


def get_gpu_info() -> Dict[str, Any]:
    """Get GPU information"""
    gpu_info = {
        'cuda_available': torch.cuda.is_available(),
        'cuda_version': torch.version.cuda if torch.cuda.is_available() else None,
        'devices': []
    }
    
    if torch.cuda.is_available():
        gpu_count = torch.cuda.device_count()
        for i in range(gpu_count):
            device_props = torch.cuda.get_device_properties(i)
            device_memory = torch.cuda.get_device_properties(i).total_memory
            
            gpu_info['devices'].append({
                'id': i,
                'name': device_props.name,
                'compute_capability': f"{device_props.major}.{device_props.minor}",
                'total_memory_gb': round(device_memory / (1024**3), 2),
                'memory_allocated_gb': round(torch.cuda.memory_allocated(i) / (1024**3), 2),
                'memory_reserved_gb': round(torch.cuda.memory_reserved(i) / (1024**3), 2)
            })
    
    return gpu_info


def get_disk_info() -> Dict[str, Any]:
    """Get disk information"""
    disk = psutil.disk_usage('/')
    return {
        'total_gb': round(disk.total / (1024**3), 2),
        'used_gb': round(disk.used / (1024**3), 2),
        'free_gb': round(disk.free / (1024**3), 2),
        'percent': disk.percent
    }


def get_system_info() -> Dict[str, Any]:
    """Get complete system information"""
    return {
        'platform': {
            'system': platform.system(),
            'release': platform.release(),
            'version': platform.version(),
            'python_version': platform.python_version()
        },
        'cpu': get_cpu_info(),
        'memory': get_memory_info(),
        'gpu': get_gpu_info(),
        'disk': get_disk_info(),
        'pytorch': {
            'version': torch.__version__,
            'cuda_available': torch.cuda.is_available(),
            'cudnn_enabled': torch.backends.cudnn.enabled,
            'cudnn_version': torch.backends.cudnn.version() if torch.backends.cudnn.enabled else None
        }
    }
