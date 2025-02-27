// src/components/dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import { useTheme } from '../../contexts/ThemeContext';

// Import dashboard tabs
import MainTab from './MainTab';
import StatsTab from './StatsTab';
import AchievementsTab from './AchievementsTab';
import HistoryTab from './HistoryTab';
import SettingsTab from './SettingsTab';

// Import CRT components
import {
  ConsoleContainer,
  ConsoleHeader,
  ConsoleFooter,
  MainDisplay,
  Sidebar,
  Panel,
  CRTScreen,
  TabContainer,
  Tab,
  LED,
  DataDisplay,
  DataLabel,
  DataValue,
  Switch,
  CRTButton,
  Knob,
  Blinker
} from '../crt/CRTComponents';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('main');
  const { userData } = useUserData();
  const { logout } = useAuth();
  const { theme, colorScheme, toggleTheme, changeColorScheme } = useTheme();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [systemStatus, setSystemStatus] = useState<'online' | 'standby'>('online');

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

  const toggleSystemStatus = () => {
    setSystemStatus(prev => prev === 'online' ? 'standby' : 'online');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleColorSchemeChange = (scheme: 'green' | 'amber' | 'blue') => {
    changeColorScheme(scheme);
  };

  return (
    <ConsoleContainer themeMode={theme}>
      <ConsoleHeader themeMode={theme}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <LED active={systemStatus === 'online'} color={systemStatus === 'online' ? 'var(--button-success)' : undefined} />
            <span style={{ marginLeft: '8px', fontSize: '0.8rem' }}>SYSTEM {systemStatus.toUpperCase()}</span>
          </div>
          <DataDisplay>
            <DataLabel>LIFE-OS v1.0</DataLabel>
          </DataDisplay>
        </div>
        
        <DataDisplay>
          <DataValue>{currentDateTime}</DataValue>
        </DataDisplay>
      </ConsoleHeader>

      <MainDisplay>
        {/* Left Sidebar */}
        <Sidebar>
          <Panel themeMode={theme}>
            <DataDisplay>
              <DataLabel>USER:</DataLabel>
              <DataValue>{userData.userProfile.name}</DataValue>
            </DataDisplay>
            <DataDisplay>
              <DataLabel>AGE:</DataLabel>
              <DataValue>{userData.userProfile.age}</DataValue>
            </DataDisplay>
            <DataDisplay>
              <DataLabel>LEVEL:</DataLabel>
              <DataValue>{userData.stats.level}</DataValue>
            </DataDisplay>
            <DataDisplay>
              <DataLabel>XP:</DataLabel>
              <DataValue>{userData.stats.xp}/{userData.stats.maxXp}</DataValue>
            </DataDisplay>
          </Panel>
          
          <Panel themeMode={theme}>
            <DataDisplay>
              <DataLabel>STEPS:</DataLabel>
              <DataValue>{userData.stats.steps}/{userData.goals.steps}</DataValue>
            </DataDisplay>
            <DataDisplay>
              <DataLabel>CALORIES:</DataLabel>
              <DataValue>{userData.stats.calories}/{userData.goals.calories}</DataValue>
            </DataDisplay>
            <DataDisplay>
              <DataLabel>SLEEP:</DataLabel>
              <DataValue>{userData.stats.sleepDuration}</DataValue>
            </DataDisplay>
            <DataDisplay>
              <DataLabel>GYM:</DataLabel>
              <DataValue>{userData.stats.gymSession}</DataValue>
            </DataDisplay>
          </Panel>
          
          <Panel themeMode={theme}>
            <DataDisplay>
              <DataLabel>SYSTEM CONTROLS</DataLabel>
            </DataDisplay>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>POWER</span>
                <Switch on={systemStatus === 'online'} onClick={toggleSystemStatus} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>THEME</span>
                <Switch on={theme === 'dark'} onClick={toggleTheme} />
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <span>COLOR SCHEME</span>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <CRTButton 
                    onClick={() => handleColorSchemeChange('green')}
                    style={{ 
                      backgroundColor: 'var(--green-primary)', 
                      opacity: colorScheme === 'green' ? 1 : 0.5
                    }}
                  >
                    G
                  </CRTButton>
                  <CRTButton 
                    onClick={() => handleColorSchemeChange('amber')}
                    style={{ 
                      backgroundColor: 'var(--amber-primary)', 
                      opacity: colorScheme === 'amber' ? 1 : 0.5
                    }}
                  >
                    A
                  </CRTButton>
                  <CRTButton 
                    onClick={() => handleColorSchemeChange('blue')}
                    style={{ 
                      backgroundColor: 'var(--blue-primary)', 
                      opacity: colorScheme === 'blue' ? 1 : 0.5
                    }}
                  >
                    B
                  </CRTButton>
                </div>
              </div>
              
              <CRTButton 
                variant="warning" 
                onClick={handleLogout}
                style={{ marginTop: '20px' }}
              >
                LOG OUT
              </CRTButton>
            </div>
          </Panel>
        </Sidebar>
        
        {/* Main Screen */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <TabContainer>
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
          </TabContainer>
          
          <CRTScreen themeMode={theme}>
            <Routes>
              <Route path="/" element={<MainTab />} />
              <Route path="stats" element={<StatsTab />} />
              <Route path="achievements" element={<AchievementsTab />} />
              <Route path="history" element={<HistoryTab />} />
              <Route path="settings" element={<SettingsTab />} />
            </Routes>
          </CRTScreen>
        </div>
        
        {/* Right Sidebar */}
        <Sidebar>
          <Panel themeMode={theme}>
            <DataDisplay>
              <DataLabel>DAILY MISSION</DataLabel>
            </DataDisplay>
            {userData.dailyAchievements.slice(0, 1).map((achievement, index) => (
              <div key={index} style={{ marginTop: '10px' }}>
                <DataDisplay>
                  <DataValue>{achievement.name}</DataValue>
                </DataDisplay>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: 'rgba(0,0,0,0.2)', 
                  borderRadius: '5px',
                  marginTop: '5px'
                }}>
                  {achievement.status === 'COMPLETED' ? (
                    <span style={{ color: 'var(--button-success)' }}>✓ COMPLETED (+{achievement.xp} XP)</span>
                  ) : (
                    <span>IN PROGRESS (+{achievement.xp} XP)</span>
                  )}
                </div>
              </div>
            ))}
          </Panel>
          
          <Panel themeMode={theme}>
            <DataDisplay>
              <DataLabel>SYSTEM LOGS</DataLabel>
            </DataDisplay>
            <div style={{ 
              height: '200px', 
              backgroundColor: 'rgba(0,0,0,0.3)', 
              padding: '10px',
              borderRadius: '5px',
              marginTop: '10px',
              overflowY: 'auto',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)'
            }}>
              {userData.stats.logs.slice(0, 10).map((log, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  <span style={{ opacity: 0.7 }}>[{log.timestamp}]</span> {log.type}: {log.value}
                </div>
              ))}
              <div>
                <span style={{ opacity: 0.7 }}>[{new Date().toLocaleTimeString()}]</span> system ready <Blinker />
              </div>
            </div>
          </Panel>
          
          <Panel themeMode={theme}>
            <DataDisplay>
              <DataLabel>WEEKLY GYM CHALLENGE</DataLabel>
            </DataDisplay>
            <div style={{ marginTop: '10px' }}>
              <DataDisplay>
                <DataLabel>SESSIONS:</DataLabel>
                <DataValue>{userData.stats.gymSessionsThisWeek}/{userData.goals.gymWeekly}</DataValue>
              </DataDisplay>
              <div style={{ 
                width: '100%', 
                height: '20px', 
                backgroundColor: 'rgba(0,0,0,0.3)', 
                marginTop: '10px',
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${(userData.stats.gymSessionsThisWeek / parseInt(userData.goals.gymWeekly)) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary-color)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </Panel>
        </Sidebar>
      </MainDisplay>

      <ConsoleFooter themeMode={theme}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Knob />
          <Knob />
          <LED active={true} />
          <LED active={false} />
          <LED active={true} color="var(--amber-primary)" />
        </div>
        
        <div>
          <span>© 2025 LIFE-OS TERMINAL • ALL RIGHTS RESERVED</span>
        </div>
        
        <div>
          <span>SIGNAL STRENGTH: OPTIMAL</span>
        </div>
      </ConsoleFooter>
    </ConsoleContainer>
  );
};

export default Dashboard;