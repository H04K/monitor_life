// src/components/auth/Register.tsx
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Styled components (reusing styles from Login)
const RegisterContainer = styled.div`
  background-color: #000000;
  border: 2px solid #ff9900;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 10px #ff9900;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.h2`
  color: #ff9900;
  margin-bottom: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 5px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #ff9900;
  color: #ff9900;
  font-family: 'VT323', monospace;
`;

interface ErrorMessageProps {
  visible: boolean;
}

const ErrorMessage = styled.div<ErrorMessageProps>`
  color: #ff3333;
  margin-top: 5px;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const Button = styled.button`
  background: #ff6600;
  border: 1px solid #ff9900;
  padding: 8px 15px;
  cursor: pointer;
  margin-top: 10px;
  color: #000000;
  font-family: 'VT323', monospace;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background: #cc5500;
  }

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Register the user
      const user = await register(email, password);
      
      // Initialize user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        userProfile: {
          name: email.split('@')[0],
          age: 25
        },
        stats: {
          level: 1,
          xp: 0,
          maxXp: 100,
          sleepDuration: "8h",
          weight: "78.5",
          steps: "8432",
          calories: "2100",
          screenTime: "5.2",
          gymSession: "Completed",
          logs: [],
          dayCompleted: false,
          gymSessionsThisWeek: 0
        },
        goals: {
          steps: "10000",
          calories: "2000",
          sleep: "8",
          gymWeekly: "3"
        },
        achievements: [
          { name: "Early Bird", status: "IN PROGRESS" },
          { name: "Gym Warrior", status: "IN PROGRESS" },
          { name: "Nutrition Master", status: "IN PROGRESS" },
          { name: "Step Master", status: "IN PROGRESS" },
          { name: "Sleep Guardian", status: "IN PROGRESS" },
          { name: "Digital Wellness", status: "IN PROGRESS" }
        ],
        dailyAchievements: [
          { name: "Morning Jog", status: "IN PROGRESS", xp: 20, condition: "steps >= 10000" },
          { name: "Healthy Meal", status: "IN PROGRESS", xp: 15, condition: "calories >= 2000" },
          { name: "Screen Break", status: "IN PROGRESS", xp: 10, condition: "screenTime <= 4" }
        ],
        history: []
      });
      
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Failed to create an account. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <RegisterContainer>
      <Title>REGISTER</Title>
      {error && <ErrorMessage visible={!!error}>{error}</ErrorMessage>}
      <form onSubmit={handleRegister}>
        <FormGroup>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </FormGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'REGISTERING...' : 'REGISTER'}
        </Button>
        <Button type="button" onClick={() => navigate('/login')} disabled={loading}>
          BACK TO LOGIN
        </Button>
      </form>
    </RegisterContainer>
  );
};

export default Register;