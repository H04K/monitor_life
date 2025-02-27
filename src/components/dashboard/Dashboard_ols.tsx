// src/components/dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';

// Import dashboard tabs
import MainTab from './MainTab';
import StatsTab from './StatsTab';
import AchievementsTab from './AchievementsTab';
import HistoryTab from './HistoryTab';
import SettingsTab from './SettingsTab';

// Import styled components
import {
  TerminalContainer,
  Header,
  UserInfo,
  TabsContainer,
  Tab,
  ContentContainer
} from './StyledComponents'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('main');
  const { userData } = useUserData();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    // Initial date/time set
    updateDateTime();
    
    // Update date/time every minute
    const interval = setInterval(updateDateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    setCurrentDateTime(`${hours}:${minutes}:${seconds} | ${day}/${month}/${year}`);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab === 'main' ? '' : tab}`);
  };

  return (
    <TerminalContainer>
      <Header>
        {currentDateTime}
      </Header>

      <UserInfo>
        Name: <span>{userData.userProfile.name}</span> | 
        Age: <span>{userData.userProfile.age}</span> | 
        Level: <span>{userData.stats.level}</span> | 
        XP: <span>{userData.stats.xp}/{userData.stats.maxXp}</span>
      </UserInfo>

      <TabsContainer>
        <Tab 
          active={activeTab === 'main'} 
          onClick={() => handleTabClick('main')}
        >
          MAIN
        </Tab>
        <Tab 
          active={activeTab === 'stats'} 
          onClick={() => handleTabClick('stats')}
        >
          STATS
        </Tab>
        <Tab 
          active={activeTab === 'achievements'} 
          onClick={() => handleTabClick('achievements')}
        >
          ACHIEVEMENTS
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => handleTabClick('history')}
        >
          HISTORY
        </Tab>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => handleTabClick('settings')}
        >
          SETTINGS
        </Tab>
      </TabsContainer>

      <ContentContainer>
        <Routes>
          <Route path="/" element={<MainTab />} />
          <Route path="stats" element={<StatsTab />} />
          <Route path="achievements" element={<AchievementsTab />} />
          <Route path="history" element={<HistoryTab />} />
          <Route path="settings" element={<SettingsTab />} />
        </Routes>
      </ContentContainer>
    </TerminalContainer>
  );
};

export default Dashboard;