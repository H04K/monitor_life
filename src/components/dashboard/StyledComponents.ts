// src/components/dashboard/StyledComponents.ts
import styled from 'styled-components';

export const TerminalContainer = styled.div`
  background-color: #000000;
  border: 2px solid #ff9900;
  box-shadow: 0 0 20px 5px rgba(255, 153, 0, 0.3), inset 0 0 10px rgba(255, 153, 0, 0.1);
  padding: 15px;
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  height: 90vh;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const Header = styled.div`
  text-align: right;
  font-size: 14px;
  margin-bottom: 10px;
  color: #ff9900;
  opacity: 0.8;
`;

export const UserInfo = styled.div`
  margin-bottom: 15px;
  border: 1px solid #ff9900;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  font-size: 16px;
`;

export const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
  background: transparent;
  border: none;
`;

export const Tab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#ff9900' : 'transparent'};
  color: ${props => props.active ? '#000000' : '#ff9900'};
  border: ${props => props.active ? '1px solid #ff9900' : 'none'};
  padding: 8px 15px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  transition: all 0.3s ease;
  font-family: 'VT323', monospace;
  font-size: 18px;
  outline: none;

  &:hover {
    background: ${props => props.active ? '#ff9900' : 'rgba(255, 153, 0, 0.2)'};
  }
`;

export const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  scrollbar-width: thin;
`;

export const Section = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ff9900;
  padding: 15px;
  background: rgba(0, 0, 0, 0.7);
`;

export const SectionTitle = styled.h2`
  color: #ff9900;
  margin-bottom: 15px;
  font-size: 22px;
  text-transform: uppercase;
`;

export const StatsItem = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  margin: 10px 0;
  gap: 10px;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  background: #000;
  border: 1px solid #ff9900;
  color: #ff9900;
  font-family: 'VT323', monospace;
  font-size: 16px;
  outline: none;
  
  &:focus {
    box-shadow: 0 0 5px rgba(255, 153, 0, 0.5);
  }
`;

export const Button = styled.button`
  background: #ff6600;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  color: #000;
  font-family: 'VT323', monospace;
  font-size: 16px;
  transition: all 0.3s ease;
  min-width: 80px;
  outline: none;
  
  &:hover {
    background: #ff9900;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

export const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

export const Achievement = styled.div<{ completed?: boolean }>`
  background: ${props => props.completed ? 'rgba(34, 139, 34, 0.3)' : 'rgba(0, 0, 0, 0.7)'};
  border: 1px solid ${props => props.completed ? '#4CAF50' : '#ff9900'};
  padding: 12px;
  text-align: center;
  font-size: 16px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

export const AchievementTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

export const AchievementStatus = styled.div<{ completed?: boolean }>`
  color: ${props => props.completed ? '#4CAF50' : '#ff9900'};
  margin-top: 5px;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  height: 6px;
  background: #333;
  margin-top: 5px;
  margin-bottom: 10px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => Math.min(100, props.progress)}%;
    background: linear-gradient(to right, #ff6600, #ff9900);
  }
`;

export const BlinkingCursor = styled.span`
  animation: blink 1s step-end infinite;
  
  @keyframes blink {
    from, to {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;