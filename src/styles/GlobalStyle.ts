// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #121212;
    font-family: 'VT323', monospace;
    color: #ff9900;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
    font-size: 16px;
  }

  input, button {
    font-family: 'VT323', monospace;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #ff9900;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #000 inset !important;
    -webkit-text-fill-color: #ff9900 !important;
  }

  /* Customize scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #000; 
  }
  
  ::-webkit-scrollbar-thumb {
    background: #ff6600; 
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #ff9900; 
  }
`;

export default GlobalStyle;