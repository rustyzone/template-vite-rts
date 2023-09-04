console.log('init react shadow root');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './ShadowApp';

// Replace this with your desired ID
const ONPAGE_SHADOW_ROOT_ID = 'myShadowRoot'; 

const rootElem = document.createElement('div');
rootElem.id = ONPAGE_SHADOW_ROOT_ID;
rootElem.style.cssText = `
  all: initial;
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  pointer-events: none;
`;

// Create the shadow root
const shadowRoot = rootElem.attachShadow({ mode: 'open' });

// Render the React app inside the shadow root
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  // Use the shadow root as the container
  shadowRoot
);


// Append the shadow root to the document body
document.body.appendChild(rootElem);