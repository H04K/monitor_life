// src/components/auth/Login.tsx
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

// CRT login-specific styled components
const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const flicker = keyframes`
  0% { opacity: 0.97; }
  5% { opacity: 0.9; }
  10% { opacity: 1; }
  15% { opacity: 0.93; }
  20% { opacity: 1; }
  50% { opacity: 0.98; }
  80% { opacity: 0.96; }
  100% { opacity: 1; }
`;

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

const CRTContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: var(--dark-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%, 
      rgba(0, 0, 0, 0.25) 50%
    );
    background-size: 100% 4px;
    z-index: 2;
    pointer-events: none;
    animation: ${scanline} 10s linear infinite;
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
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.5) 90%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const LoginBox = styled.div`
  position: relative;
  width: 90%;
  max-width: 450px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 2px solid var(--console-border);
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 0 30px var(--glow-color);
  z-index: 3;
  animation: ${flicker} 0.3s infinite alternate;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--primary-color);
    animation: ${glitch} 2s infinite;
    z-index: 4;
  }
`;

const Title = styled.h1`
  color: var(--primary-color);
  font-family: var(--font-display);
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px var(--glow-color);
  position: relative;
  animation: ${glitch} 5s infinite;
`;

const InputGroup = styled.div`
  margin-bottom: 25px;
`;

const InputLabel = styled.label`
  display: block;
  color: var(--secondary-color);
  margin-bottom: 8px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--console-border);
  border-radius: 4px;
  color: var(--primary-color);
  font-family: var(--font-mono);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 10px var(--glow-color);
  }
  
  &::placeholder {
    color: rgba(var(--primary-color-rgb), 0.5);
  }
`;

const ErrorMessage = styled.div`
  color: var(--button-warning);
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border-left: 3px solid var(--button-warning);
  font-family: var(--font-mono);
  animation: ${glitch} 1s infinite;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: black;
  border: none;
  border-radius: 4px;
  font-family: var(--font-display);
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: var(--secondary-color);
    box-shadow: 0 0 15px var(--glow-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -60%;
    width: 20%;
    height: 200%;
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(30deg);
    transition: all 0.6s ease;
  }
  
  &:hover::after {
    left: 120%;
  }
`;

const SystemText = styled.div`
  font-family: var(--font-mono);
  color: var(--secondary-color);
  font-size: 0.8rem;
  margin-top: 20px;
  opacity: 0.7;
`;

const BootSequence = styled.div`
  font-family: var(--font-mono);
  color: var(--primary-color);
  margin-bottom: 30px;
  font-size: 0.9rem;
  line-height: 1.5;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  height: 100px;
  overflow-y: auto;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 18px;
  background: var(--primary-color);
  margin-left: 5px;
  animation: blink 1s step-end infinite;
  
  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }
`;

// Login component
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootPhase, setBootPhase] = useState(0);
  const { login, currentUser } = useAuth();
  const { theme, colorScheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate boot sequence
    const bootInterval = setInterval(() => {
      setBootPhase(prev => {
        if (prev < 4) return prev + 1;
        clearInterval(bootInterval);
        return prev;
      });
    }, 800);
    
    return () => clearInterval(bootInterval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim() || !password) {
      setError('ERROR: Authorization parameters incomplete.');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('ERROR: Invalid authentication credential format.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('ERROR: Authorization failed. Security protocols engaged.');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <CRTContainer>
      <LoginBox>
        <Title>Life:Terminal</Title>
        
        <BootSequence>
          {bootPhase >= 1 && (
            <>LIFE-OS v1.0 loading...<br /></>
          )}
          {bootPhase >= 2 && (
            <>System integrity verified<br /></>
          )}
          {bootPhase >= 3 && (
            <>User authentication required<br /></>
          )}
          {bootPhase >= 4 && (
            <>Ready for login<Cursor /></>
          )}
        </BootSequence>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleLogin}>
          <InputGroup>
            <InputLabel>User Identifier</InputLabel>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || bootPhase < 4}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <InputLabel>Security Key</InputLabel>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || bootPhase < 4}
              required
            />
          </InputGroup>
          
          <Button 
            type="submit" 
            disabled={loading || bootPhase < 4}
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </Button>
          
          <Button 
            type="button" 
            onClick={() => navigate('/register')} 
            disabled={loading || bootPhase < 4}
            style={{ backgroundColor: 'transparent', color: 'var(--primary-color)', marginTop: '10px' }}
          >
            REGISTER NEW USER
          </Button>
        </form>
        
        <SystemText>
          LIFE-OS © 2025 QUANTUM SYSTEMS CORPORATION<br />
          ALL RIGHTS RESERVED • UNAUTHORIZED ACCESS PROHIBITED
        </SystemText>
      </LoginBox>
    </CRTContainer>
  );
};

export default Login;