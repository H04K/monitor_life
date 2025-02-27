// src/components/auth/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const LoadingContainer = styled.div`
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
  text-align: center;
`;

const LoadingText = styled.p`
  color: #ff9900;
  font-size: 1.2rem;
`;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;