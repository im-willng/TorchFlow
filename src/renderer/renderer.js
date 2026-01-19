import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

console.log('Renderer.js loaded');
console.log('React:', typeof React);
console.log('ReactDOM:', typeof ReactDOM);
console.log('App component:', typeof App);
console.log('Root element:', document.getElementById('root'));

const rootElement = document.getElementById('root');
if (rootElement) {
    console.log('Rendering App...');
    ReactDOM.render(<App />, rootElement);
    console.log('App rendered successfully');
} else {
    console.error('Root element not found!');
}
