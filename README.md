# PyTorch Deep Learning IDE

A desktop application for building, training, and exporting PyTorch deep learning models using a visual node-based editor.

## Features

- **Visual Node Editor**: Drag-and-drop interface for building neural networks
- **8 Layer Types**: Input, Linear, Conv2D, ReLU, BatchNorm, Dropout, Flatten, Softmax
- **Graph Validation**: Automatic shape checking and DAG validation
- **Code Generation**: Generate clean, readable PyTorch code
- **MNIST Training**: Train models directly in the app
- **Real-time Visualization**: Live loss and accuracy charts
- **Model Export**: Export both code and trained weights

## Architecture

```
┌─────────────────────────────────────────┐
│         Electron Main Process           │
│  - Window management                    │
│  - Python subprocess spawner            │
│  - IPC bridge                           │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────────┐    ┌──────────────────┐
│   React UI  │    │  Python Worker   │
│             │    │                  │
│ - Node      │    │ - Graph Parser   │
│   Editor    │◄───┤ - Code Gen       │
│ - Params    │    │ - Training       │
│ - Charts    │───►│ - Validation     │
└─────────────┘    └──────────────────┘
                         │
                         ▼
                   ┌──────────┐
                   │ PyTorch  │
                   └──────────┘
```

## Installation

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- PyTorch 2.0+

### Setup

1. **Install Node dependencies:**
```bash
cd d:\dlapp
npm install
```

2. **Install Python dependencies:**
```bash
cd d:\dlapp\backend
pip install -r requirements.txt
```

## Usage

### Development Mode

```bash
npm run dev
```

This will:
- Start Electron with DevTools open
- Launch Python backend subprocess
- Enable hot reload for development

### Production Build

```bash
npm run build
```

### Building the Application

1. **Build React bundle:**
```bash
npx webpack
```

2. **Run application:**
```bash
npm start
```

## How to Use

### 1. Build Your Model

- Drag layers from the palette onto the canvas
- Connect layers by dragging from output (right) to input (left) handles
- Edit layer parameters by clicking on the node

### 2. Validate Graph

- Click "Validate Graph" to check for errors
- View total parameters in the control panel
- Fix any validation errors shown in logs

### 3. Train Model

- Configure optimizer (Adam/SGD), learning rate, epochs
- Click "Start Training"
- Watch real-time loss and accuracy charts
- Stop training anytime with "Stop Training"

### 4. Export Model

- After training, click "Export Model"
- Find exported files in `./exports/`:
  - `model.py` - Generated PyTorch code
  - `model.pt` - Trained weights
  - `metadata.txt` - Training configuration

## Example: MNIST Classifier

Build a simple MNIST classifier:

1. Add **Input** node: shape = [1, 28, 28]
2. Add **Flatten** node
3. Add **Linear** node: in_features = 784, out_features = 128
4. Add **ReLU** node
5. Add **Linear** node: in_features = 128, out_features = 10
6. Connect: Input → Flatten → Linear → ReLU → Linear

Configure training:
- Optimizer: Adam
- Learning Rate: 0.001
- Epochs: 10

Expected accuracy: ~95-97%

## Project Structure

```
d:\dlapp\
├── backend/                 # Python backend
│   ├── main.py             # Entry point
│   ├── schema.py           # Node type definitions
│   ├── graph_parser.py     # Graph validation
│   ├── code_generator.py   # PyTorch code generation
│   ├── training_engine.py  # MNIST training
│   ├── model_exporter.py   # Export functionality
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── main/               # Electron main process
│   │   ├── main.js        # Window management
│   │   └── pythonBridge.js # Subprocess communication
│   └── renderer/           # React UI
│       ├── App.jsx        # Main component
│       ├── components/
│       │   ├── NodeEditor.jsx      # ReactFlow editor
│       │   ├── NodePalette.jsx     # Layer palette
│       │   ├── ControlPanel.jsx    # Training controls
│       │   ├── TrainingChart.jsx   # Visualization
│       │   └── nodes/              # Custom node types
│       │       ├── InputNode.jsx
│       │       ├── LinearNode.jsx
│       │       ├── Conv2DNode.jsx
│       │       ├── ActivationNode.jsx
│       │       ├── NormNode.jsx
│       │       ├── DropoutNode.jsx
│       │       └── FlattenNode.jsx
│       └── index.html
├── package.json
├── webpack.config.js
└── README.md
```

## Communication Protocol

### Frontend → Backend (stdin)

```json
{
  "command": "train",
  "graph": {
    "nodes": [...],
    "edges": [...]
  },
  "config": {
    "optimizer": "adam",
    "lr": 0.001,
    "epochs": 10
  }
}
```

### Backend → Frontend (stdout)

```json
{"event": "training_start", "data": {"total_epochs": 10}}
{"event": "epoch_end", "data": {"epoch": 1, "loss": 0.45, "accuracy": 0.87}}
{"event": "training_complete", "data": {"final_loss": 0.12, "final_accuracy": 0.96}}
```

## Supported Layer Types

| Layer | Parameters | Description |
|-------|-----------|-------------|
| Input | shape | Define input tensor shape |
| Linear | in_features, out_features | Fully connected layer |
| Conv2D | in_channels, out_channels, kernel_size, stride, padding | 2D convolution |
| ReLU | - | ReLU activation |
| BatchNorm | num_features | Batch normalization |
| Dropout | p | Dropout regularization |
| Flatten | - | Flatten to 1D |
| Softmax | dim | Softmax activation |

## Troubleshooting

### Python subprocess not starting

- Ensure Python is in PATH
- Check `backend/requirements.txt` dependencies are installed
- Look for errors in the Logs panel

### Training not starting

- Validate graph first
- Ensure all nodes are connected properly
- Check for shape mismatches in logs

### MNIST download fails

- Check internet connection
- Dataset downloads to `./data/` automatically
- May take a few minutes on first run

## License

MIT

## Credits

Built with:
- Electron
- React
- ReactFlow
- Recharts
- PyTorch
