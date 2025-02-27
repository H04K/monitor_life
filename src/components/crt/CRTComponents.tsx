// src/components/crt/CRTComponents.tsx
import styled, { css } from 'styled-components';

// Define prop types for our components
interface ThemeProps {
  themeMode?: 'dark' | 'light';
}

interface ProgressProps {
  progress: number;
  value: number;
}

interface ActiveProps {
  active: boolean;
  color?: string;
}

interface CompletedProps {
  completed?: boolean;
}

interface SwitchProps {
  on: boolean;
}

// Update the ConsoleContainer in CRTComponents.tsx
export const ConsoleContainer = styled.div<ThemeProps>`
  position: relative;
  width: 100vw;
  /* Change from fixed height to min-height */
  min-height: 100vh;
  max-height: 100vh; 
  background-color: ${props => props.themeMode === 'dark' ? 'var(--dark-console)' : 'var(--light-console)'};
  padding: 20px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  /* Add proper overflow handling */
  overflow-y: auto;
  overflow-x: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 10;
    animation: scan 7.5s linear infinite;
  }
`;

// Header section for controls and indicators
export const ConsoleHeader = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: ${props => props.themeMode === 'dark' ? 'var(--dark-panel)' : 'var(--light-panel)'};
  border: 2px solid var(--console-border);
  border-radius: 10px 10px 0 0;
  margin-bottom: 10px;
  box-shadow: 0 0 15px var(--glow-color);
`;

// Footer section for additional controls
export const ConsoleFooter = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: ${props => props.themeMode === 'dark' ? 'var(--dark-panel)' : 'var(--light-panel)'};
  border: 2px solid var(--console-border);
  border-radius: 0 0 10px 10px;
  margin-top: 10px;
  box-shadow: 0 0 15px var(--glow-color);
`;

// Update MainDisplay component to handle overflow better
export const MainDisplay = styled.div`
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-gap: 10px;
  width: 100%;
  /* Remove fixed height and replace with min-height */
  min-height: 50vh;
  /* Add overflow handling */
  overflow-y: auto;

  /* Make it more responsive for smaller screens */
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 2fr;
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

// Update Sidebar component for better scrolling
export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  /* Use max-height instead of fixed height */
  max-height: 80vh;
  
  @media (max-width: 992px) {
    max-height: none;
  }
`;

// Panel component for containing groups of UI elements
export const Panel = styled.div<ThemeProps>`
  background-color: ${props => props.themeMode === 'dark' ? 'var(--dark-panel)' : 'var(--light-panel)'};
  border: 2px solid var(--console-border);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    pointer-events: none;
  }
`;

// CRT screen to display primary content
export const CRTScreen = styled.div<ThemeProps>`
  position: relative;
  background-color: rgba(0, 0, 0, 0.2);
  border: 5px solid ${props => props.themeMode === 'dark' ? 'var(--dark-panel)' : 'var(--light-panel)'};
  border-radius: 15px;
  padding: 15px;
  /* Change to min-height and add max-height */
  min-height: 40vh;
  max-height: 80vh;
  overflow-y: auto;
  color: var(--primary-color);
  box-shadow: 0 0 20px var(--glow-color), inset 0 0 15px rgba(0, 0, 0, 0.7);
  animation: flicker 0.3s infinite alternate;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%, 
      rgba(var(--primary-color-rgb), 0.1) 50%
    );
    background-size: 100% 4px;
    z-index: 2;
    pointer-events: none;
    opacity: 0.2;
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center,
      var(--glow-color) 0%,
      rgba(0, 0, 0, 0.5) 100%
    );
    opacity: 0.15;
    pointer-events: none;
    z-index: 1;
  }
`;

// Title for panels
export const PanelTitle = styled.h2`
  color: var(--primary-color);
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-transform: uppercase;
  text-shadow: 0 0 5px var(--glow-color);
  letter-spacing: 1px;
  border-bottom: 1px solid var(--secondary-color);
  padding-bottom: 5px;
`;

// Buttons with CRT styling
export const CRTButton = styled.button<{ variant?: 'primary' | 'warning' | 'success' }>`
  background-color: ${props => {
    if (props.variant === 'warning') return 'var(--button-warning)';
    if (props.variant === 'success') return 'var(--button-success)';
    return 'var(--primary-color)';
  }};
  color: #000;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 1rem;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 0 10px ${props => {
      if (props.variant === 'warning') return 'var(--button-warning)';
      if (props.variant === 'success') return 'var(--button-success)';
      return 'var(--primary-color)';
    }};
  }
  
  &:active {
    background-color: var(--button-active);
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Input fields with CRT styling
export const CRTInput = styled.input`
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--console-border);
  border-radius: 5px;
  padding: 8px 12px;
  color: var(--primary-color);
  font-family: var(--font-mono);
  width: 100%;
  outline: none;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 5px var(--glow-color);
  }
  
  &::placeholder {
    color: var(--secondary-color);
    opacity: 0.7;
  }
`;

// Tab navigation for CRT interface
export const TabContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  border-bottom: 2px solid var(--console-border);
`;

export const Tab = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  padding: 8px 16px;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--secondary-color)'};
  font-family: var(--font-display);
  font-size: 1.2rem;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  
  ${props => props.active && css`
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--primary-color);
      box-shadow: 0 0 5px var(--glow-color);
    }
  `}
  
  &:hover {
    color: var(--primary-color);
  }
`;

// Data display with label and value
export const DataDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 5px 0;
  border-bottom: 1px dashed var(--console-border);
  
  &:last-child {
    border-bottom: none;
  }
`;

export const DataLabel = styled.span`
  color: var(--secondary-color);
  font-family: var(--font-mono);
`;

export const DataValue = styled.span`
  color: var(--primary-color);
  font-family: var(--font-mono);
  font-weight: bold;
`;

// Progress bar with CRT styling
export const ProgressContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--console-border);
  border-radius: 4px;
  margin: 10px 0;
  overflow: hidden;
  position: relative;
`;

export const ProgressBar = styled.div<ProgressProps>`
  height: 100%;
  width: ${props => Math.min(100, props.progress)}%;
  background-color: var(--primary-color);
  box-shadow: 0 0 10px var(--glow-color);
  transition: width 0.3s ease;
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.1) 10px,
      rgba(0, 0, 0, 0.1) 20px
    );
    z-index: 1;
    animation: scan 10s linear infinite;
  }
`;

// Grid for achievements or data cards
export const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

export const DataCard = styled.div<CompletedProps>`
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.completed ? 'var(--button-success)' : 'var(--console-border)'};
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  ${props => props.completed && css`
    box-shadow: 0 0 5px var(--button-success);
  `}
`;

// LED indicator
export const LED = styled.div<ActiveProps>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active 
    ? (props.color || 'var(--primary-color)') 
    : 'rgba(30, 30, 30, 0.5)'};
  box-shadow: 0 0 ${props => props.active ? '5px' : '0'} ${props => props.color || 'var(--glow-color)'};
  transition: all 0.2s ease;
`;

// UI Controls like knobs and switches
export const ControlsSection = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin: 15px 0;
`;

export const Knob = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle at center, #555, #222);
  border: 2px solid var(--console-border);
  position: relative;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 15px;
    background-color: var(--primary-color);
    transform: translate(-50%, -50%);
    transform-origin: bottom center;
  }
`;

export const Switch = styled.div<SwitchProps>`
  width: 40px;
  height: 20px;
  background-color: ${props => props.on ? 'var(--primary-color)' : 'rgba(30, 30, 30, 0.5)'};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.on ? '22px' : '2px'};
    width: 16px;
    height: 16px;
    background-color: #fff;
    border-radius: 50%;
    transition: left 0.3s ease;
  }
`;

// Container for a gauge-style meter
export const Meter = styled.div`
  width: 100%;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--console-border);
  border-radius: 5px;
  position: relative;
  margin: 15px 0;
  overflow: hidden;
`;

export const MeterScale = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const MeterLabel = styled.div`
  color: var(--primary-color);
  font-family: var(--font-mono);
  font-size: 0.8rem;
`;

export const MeterNeedle = styled.div<ProgressProps>`
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 80%;
  height: 2px;
  background-color: var(--primary-color);
  transform-origin: left center;
  transform: ${props => `rotate(${(props.progress * 180) / 100 - 90}deg)`};
  transition: transform 0.5s ease;
  box-shadow: 0 0 5px var(--glow-color);
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 10px;
    height: 10px;
    background-color: var(--primary-color);
    border-radius: 50%;
    box-shadow: 0 0 5px var(--glow-color);
  }
`;

// Blinker for terminal cursor
export const Blinker = styled.span`
  display: inline-block;
  width: 10px;
  height: 20px;
  background-color: var(--primary-color);
  margin-left: 5px;
  animation: blink 1s step-end infinite;
  
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;