// src/components/dashboard/AchievementsTab.tsx
import React, { useState } from 'react';
import { useUserData } from '../../contexts/UserDataContext';
import { useTheme } from '../../contexts/ThemeContext';

// Import CRT components
import {
  Panel,
  PanelTitle,
  DataDisplay,
  DataLabel,
  DataValue,
  DataGrid,
  DataCard,
  LED,
  CRTButton,
  ProgressContainer,
  ProgressBar
} from '../crt/CRTComponents';

const AchievementsTab: React.FC = () => {
  const { userData } = useUserData();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  
  // Calculate achievement stats
  const totalAchievements = userData.achievements.length + userData.dailyAchievements.length;
  const completedAchievements = 
    userData.achievements.filter(a => a.status === 'COMPLETED').length + 
    userData.dailyAchievements.filter(a => a.status === 'COMPLETED').length;
  const completionPercentage = (completedAchievements / totalAchievements) * 100;
  
  // Filter achievements based on selected filter
  const getFilteredAchievements = () => {
    if (filter === 'all') return userData.achievements;
    return userData.achievements.filter(a => 
      filter === 'completed' ? a.status === 'COMPLETED' : a.status === 'IN PROGRESS'
    );
  };
  
  const getFilteredDailyAchievements = () => {
    if (filter === 'all') return userData.dailyAchievements;
    return userData.dailyAchievements.filter(a => 
      filter === 'completed' ? a.status === 'COMPLETED' : a.status === 'IN PROGRESS'
    );
  };
  
  // Calculate potential XP from remaining achievements
  const potentialXP = userData.dailyAchievements
    .filter(a => a.status === 'IN PROGRESS')
    .reduce((total, a) => total + a.xp, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ACHIEVEMENT SUMMARY */}
      <Panel themeMode={theme}>
        <PanelTitle>ACHIEVEMENT SUMMARY</PanelTitle>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '15px'
        }}>
          <div>
            <DataDisplay>
              <DataLabel>TOTAL ACHIEVEMENTS</DataLabel>
              <DataValue>{completedAchievements} / {totalAchievements}</DataValue>
            </DataDisplay>
            <ProgressContainer>
              <ProgressBar progress={completionPercentage} value={completionPercentage} />
            </ProgressContainer>
          </div>
          
          <div>
            <DataDisplay>
              <DataLabel>REMAINING XP AVAILABLE</DataLabel>
              <DataValue>{potentialXP} XP</DataValue>
            </DataDisplay>
            
            <div style={{ 
              marginTop: '10px',
              padding: '8px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: 'var(--secondary-color)'
            }}>
              Complete daily activities to earn XP
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px',
          marginTop: '10px'
        }}>
          <CRTButton 
            onClick={() => setFilter('all')} 
            style={{ 
              opacity: filter === 'all' ? 1 : 0.7,
              backgroundColor: filter === 'all' ? 'var(--primary-color)' : 'rgba(0,0,0,0.5)',
              color: filter === 'all' ? '#000' : 'var(--primary-color)',
              border: '1px solid var(--primary-color)'
            }}
          >
            ALL
          </CRTButton>
          
          <CRTButton 
            onClick={() => setFilter('completed')} 
            style={{ 
              opacity: filter === 'completed' ? 1 : 0.7,
              backgroundColor: filter === 'completed' ? 'var(--button-success)' : 'rgba(0,0,0,0.5)',
              color: filter === 'completed' ? '#000' : 'var(--button-success)',
              border: '1px solid var(--button-success)'
            }}
          >
            COMPLETED
          </CRTButton>
          
          <CRTButton 
            onClick={() => setFilter('in-progress')} 
            style={{ 
              opacity: filter === 'in-progress' ? 1 : 0.7,
              backgroundColor: filter === 'in-progress' ? 'var(--secondary-color)' : 'rgba(0,0,0,0.5)',
              color: filter === 'in-progress' ? '#000' : 'var(--secondary-color)',
              border: '1px solid var(--secondary-color)'
            }}
          >
            IN PROGRESS
          </CRTButton>
        </div>
      </Panel>

      {/* DAILY ACHIEVEMENTS */}
      <Panel themeMode={theme}>
        <PanelTitle>DAILY ACHIEVEMENTS</PanelTitle>
        
        <DataGrid>
          {getFilteredDailyAchievements().map((achievement, index) => (
            <DataCard 
              key={index} 
              completed={achievement.status === 'COMPLETED'}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <LED active={achievement.status === 'COMPLETED'} 
                     color={achievement.status === 'COMPLETED' ? 'var(--button-success)' : undefined} />
                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  color: 'var(--primary-color)'
                }}>
                  {achievement.name}
                </div>
              </div>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ 
                  color: achievement.status === 'COMPLETED' ? 'var(--button-success)' : 'var(--secondary-color)',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem'
                }}>
                  {achievement.status}
                </span>
                <span style={{ 
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  +{achievement.xp} XP
                </span>
              </div>
              
              <div style={{ 
                fontSize: '0.8rem', 
                opacity: 0.7,
                marginTop: '5px',
                padding: '5px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '4px'
              }}>
                {achievement.condition}
              </div>
              
              {achievement.status === 'COMPLETED' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  borderLeft: '20px solid transparent',
                  borderTop: '20px solid var(--button-success)',
                }}></div>
              )}
            </DataCard>
          ))}
        </DataGrid>
      </Panel>
      
      {/* LONG-TERM ACHIEVEMENTS */}
      <Panel themeMode={theme}>
        <PanelTitle>LONG-TERM ACHIEVEMENTS</PanelTitle>
        
        <DataGrid>
          {getFilteredAchievements().map((achievement, index) => (
            <DataCard 
              key={index} 
              completed={achievement.status === 'COMPLETED'}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <LED active={achievement.status === 'COMPLETED'} 
                     color={achievement.status === 'COMPLETED' ? 'var(--button-success)' : undefined} />
                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  color: 'var(--primary-color)'
                }}>
                  {achievement.name}
                </div>
              </div>
              
              <div>
                <span style={{ 
                  color: achievement.status === 'COMPLETED' ? 'var(--button-success)' : 'var(--secondary-color)',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem'
                }}>
                  {achievement.status}
                </span>
              </div>
              
              <div style={{ 
                fontSize: '0.8rem', 
                opacity: 0.7,
                marginTop: '5px',
                padding: '5px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '4px'
              }}>
                Complete consistently to earn this achievement
              </div>
              
              {achievement.status === 'COMPLETED' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  borderLeft: '20px solid transparent',
                  borderTop: '20px solid var(--button-success)',
                }}></div>
              )}
            </DataCard>
          ))}
        </DataGrid>
      </Panel>
      
      {/* FUTURE ACHIEVEMENTS */}
      <Panel themeMode={theme}>
        <PanelTitle>UPCOMING CHALLENGES</PanelTitle>
        
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '5px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
          color: 'var(--secondary-color)'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: 'var(--primary-color)' }}>SYSTEM MESSAGE:</span> Future challenges will unlock as you progress through levels.
          </div>
          
          <div style={{
            padding: '10px',
            border: '1px dashed var(--secondary-color)',
            borderRadius: '4px',
            marginTop: '15px',
            textAlign: 'center',
            opacity: 0.8
          }}>
            NEXT CHALLENGE UNLOCKS AT LEVEL {userData.stats.level + 1}
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default AchievementsTab;