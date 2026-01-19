"""
PyTorch GUI Backend - Main Entry Point
Handles commands from Electron frontend via stdin/stdout JSON protocol
"""

import sys
import json
import traceback
from graph_parser import GraphParser
from training_engine import TrainingEngine
from model_exporter import ModelExporter
from system_info import get_system_info


def send_event(event_type, data):
    """Send event to frontend via stdout"""
    event = {
        "event": event_type,
        "data": data
    }
    print(json.dumps(event), flush=True)


def handle_validate(graph_data):
    """Validate graph structure and shape compatibility"""
    try:
        parser = GraphParser()
        result = parser.validate(graph_data)
        
        if result['valid']:
            send_event('validation_success', {
                'message': 'Graph is valid',
                'node_count': len(graph_data.get('nodes', [])),
                'total_params': result.get('total_params', 0)
            })
        else:
            send_event('validation_error', {
                'errors': result['errors']
            })
    except Exception as e:
        send_event('error', {
            'message': f'Validation failed: {str(e)}',
            'traceback': traceback.format_exc()
        })


def handle_get_system_info():
    """Get system hardware configuration"""
    try:
        info = get_system_info()
        send_event('system_info', info)
    except Exception as e:
        send_event('error', {
            'message': f'Failed to get system info: {str(e)}',
            'traceback': traceback.format_exc()
        })


def handle_train(graph_data, config):
    """Train model with given configuration"""
    try:
        # Validate graph
        parser = GraphParser()
        validation = parser.validate(graph_data)
        
        if not validation['valid']:
            send_event('error', {'message': 'Invalid graph', 'errors': validation['errors']})
            return
        
        # Start training
        engine = TrainingEngine()
        send_event('training_start', {
            'epochs': config.get('epochs', 10),
            'optimizer': config.get('optimizer', 'adam'),
            'lr': config.get('lr', 0.001)
        })
        
        # Training loop with event callbacks
        def on_epoch_end(epoch, loss, accuracy):
            send_event('epoch_end', {
                'epoch': epoch,
                'loss': float(loss),
                'accuracy': float(accuracy)
            })
        
        def on_batch_end(batch, total_batches, loss):
            send_event('batch_end', {
                'batch': batch,
                'total_batches': total_batches,
                'loss': float(loss)
            })
        
        model, final_loss, final_accuracy = engine.train(
            graph_data=graph_data,
            config=config,
            on_epoch_end=on_epoch_end,
            on_batch_end=on_batch_end
        )
        
        send_event('training_complete', {
            'final_loss': float(final_loss),
            'final_accuracy': float(final_accuracy)
        })
        
        # Store model for export
        global trained_model
        trained_model = {
            'model': model,
            'graph_data': graph_data,
            'config': config
        }
        
    except Exception as e:
        send_event('error', {
            'message': f'Training failed: {str(e)}',
            'traceback': traceback.format_exc()
        })


def handle_export(export_path):
    """Export trained model and code"""
    try:
        if 'trained_model' not in globals():
            send_event('error', {'message': 'No trained model to export'})
            return
        
        exporter = ModelExporter()
        files = exporter.export(
            model=trained_model['model'],
            graph_data=trained_model['graph_data'],
            config=trained_model['config'],
            path=export_path
        )
        
        send_event('export_complete', {
            'files': files
        })
    except Exception as e:
        send_event('error', {
            'message': f'Export failed: {str(e)}',
            'traceback': traceback.format_exc()
        })


def main():
    """Main loop - read commands from stdin"""
    send_event('ready', {'message': 'Python backend ready'})
    
    for line in sys.stdin:
        try:
            command = json.loads(line.strip())
            cmd_type = command.get('command')
            
            if cmd_type == 'validate':
                handle_validate(command.get('graph'))
            elif cmd_type == 'get_system_info':
                handle_get_system_info()
            elif cmd_type == 'train':
                handle_train(command.get('graph'), command.get('config', {}))
            elif cmd_type == 'export':
                handle_export(command.get('path', './exports'))
            else:
                send_event('error', {'message': f'Unknown command: {cmd_type}'})
                
        except json.JSONDecodeError as e:
            send_event('error', {'message': f'Invalid JSON: {str(e)}'})
        except Exception as e:
            send_event('error', {
                'message': f'Command failed: {str(e)}',
                'traceback': traceback.format_exc()
            })


if __name__ == '__main__':
    main()
