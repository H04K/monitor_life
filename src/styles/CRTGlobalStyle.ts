// src/styles/CRTGlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

const CRTGlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    /* Dark theme variables */
    --dark-bg: #0a0a0a;
    --dark-console: #151515;
    --dark-panel: #1a1a1a;
    
    /* Light theme variables */
    --light-bg: #2a2a2a;
    --light-console: #353535;
    --light-panel: #404040;
    
    /* Color scheme variables */
    --green-primary: #00ff00;
    --green-secondary: #00aa00;
    --green-glow: rgba(0, 255, 0, 0.5);
    
    --amber-primary: #ffb000;
    --amber-secondary: #cc7000;
    --amber-glow: rgba(255, 176, 0, 0.5);
    
    --blue-primary: #00ffff;
    --blue-secondary: #0088ff;
    --blue-glow: rgba(0, 255, 255, 0.5);
    
    /* Common variables */
    --button-active: #ff6600;
    --button-warning: #ff0000;
    --button-success: #00ff00;
    --console-border: #444444;
    --font-mono: 'Share Tech Mono', monospace;
    --font-display: 'VT323', monospace;

     html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  #root {
    height: 100%;
    min-height: 100vh;
  }

  /* Customize scrollbar styles for the theme */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--dark-bg);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
    border: 2px solid var(--dark-bg);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
  }
*/
  }

  body {
    font-family: var(--font-mono);
    overflow: hidden;
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    transition: background-color 0.3s ease;
  }

  /* Theme classes */
  body.dark-theme {
    background-color: var(--dark-bg);
    color: var(--green-primary);
  }

  body.light-theme {
    background-color: var(--light-bg);
    color: var(--green-primary);
  }

  /* Color scheme classes */
  body.green-scheme {
    --primary-color: var(--green-primary);
    --secondary-color: var(--green-secondary);
    --glow-color: var(--green-glow);
  }

  body.amber-scheme {
    --primary-color: var(--amber-primary);
    --secondary-color: var(--amber-secondary);
    --glow-color: var(--amber-glow);
  }

  body.blue-scheme {
    --primary-color: var(--blue-primary);
    --secondary-color: var(--blue-secondary);
    --glow-color: var(--blue-glow);
  }

  /* CRT effects */
  @keyframes flicker {
    0% { opacity: 0.97; }
    5% { opacity: 0.99; }
    10% { opacity: 0.94; }
    15% { opacity: 0.98; }
    20% { opacity: 0.92; }
    25% { opacity: 0.96; }
    30% { opacity: 0.98; }
    35% { opacity: 0.93; }
    40% { opacity: 0.97; }
    45% { opacity: 0.95; }
    50% { opacity: 0.98; }
    55% { opacity: 0.93; }
    60% { opacity: 0.99; }
    65% { opacity: 0.94; }
    70% { opacity: 0.97; }
    75% { opacity: 0.92; }
    80% { opacity: 0.95; }
    85% { opacity: 0.98; }
    90% { opacity: 0.93; }
    95% { opacity: 0.99; }
    100% { opacity: 0.97; }
  }

  @keyframes scan {
    0% { background-position: 0 -100vh; }
    100% { background-position: 0 100vh; }
  }

  /* Normalize buttons and inputs for cross-browser consistency */
  button, input, select, textarea {
    font-family: var(--font-mono);
    font-size: 1rem;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s;
    -webkit-text-fill-color: var(--primary-color) !important;
  }

  /* Custom scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
  }
`;

export default CRTGlobalStyle;