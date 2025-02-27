// src/components/dashboard/StatsTab.tsx
import React from 'react';
import { useUserData } from '../../contexts/UserDataContext';
import { useTheme } from '../../contexts/ThemeContext';

// Import CRT components
import {
  Panel,
  PanelTitle,
  DataDisplay,
  DataLabel,
  DataValue,
  ProgressContainer,
  ProgressBar,
  Meter,
  MeterScale,
  MeterNeedle,
  MeterLabel
} from '../crt/CRTComponents';

const StatsTab: React.FC = () => {
  const { userData } = useUserData();
  const { theme } = useTheme();
  
  // Calculate progress percentages
  const stepsProgress = (parseInt(userData.stats.steps) / parseInt(userData.goals.steps)) * 100;
  const caloriesProgress = (parseInt(userData.stats.calories) / parseInt(userData.goals.calories)) * 100;
  const sleepHours = parseFloat(userData.stats.sleepDuration.replace('h', ''));
  const sleepGoalHours = parseFloat(userData.goals.sleep);
  const sleepProgress = (sleepHours / sleepGoalHours) * 100;
  const xpProgress = (userData.stats.xp / userData.stats.maxXp) * 100;
  const gymProgress = (userData.stats.gymSessionsThisWeek / parseInt(userData.goals.gymWeekly)) * 100;

  // Calculate average stats from history (or use current if no history)
  const calculateAverageSteps = () => {
    if (userData.history.length === 0) return userData.stats.steps;
    const total = userData.history.reduce((sum, entry) => {
      return sum + (entry.steps ? parseInt(entry.steps) : 0);
    }, 0);
    return Math.round(total / userData.history.length).toString();
  };
  
  const calculateAverageCalories = () => {
    if (userData.history.length === 0) return userData.stats.calories;
    const total = userData.history.reduce((sum, entry) => {
      return sum + (entry.calories ? parseInt(entry.calories) : 0);
    }, 0);
    return Math.round(total / userData.history.length).toString();
  };

  const averageSteps = calculateAverageSteps();
  const averageCalories = calculateAverageCalories();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* USER LEVEL METRICS */}
      <Panel themeMode={theme}>
        <PanelTitle>USER PROGRESSION</PanelTitle>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <DataDisplay>
              <DataLabel>LEVEL</DataLabel>
              <DataValue>{userData.stats.level}</DataValue>
            </DataDisplay>
            
            <DataDisplay>
              <DataLabel>EXPERIENCE</DataLabel>
              <DataValue>{userData.stats.xp} / {userData.stats.maxXp} XP</DataValue>
            </DataDisplay>
            
            <ProgressContainer>
              <ProgressBar progress={xpProgress} value={xpProgress} />
            </ProgressContainer>
            
            <div style={{ 
              fontSize: '0.9rem',
              color: 'var(--secondary-color)',
              marginTop: '10px',
              padding: '10px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '4px'
            }}>
              Next level in {userData.stats.maxXp - userData.stats.xp} XP
            </div>
          </div>
          
          <div>
            <Meter>
              <MeterScale>
                <MeterLabel>LEVEL {userData.stats.level + 1}</MeterLabel>
                <MeterLabel>LEVEL {userData.stats.level}</MeterLabel>
              </MeterScale>
              <MeterNeedle progress={xpProgress} value={xpProgress} />
            </Meter>
            
            <div style={{ 
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>
                <DataLabel>TOTAL XP EARNED</DataLabel>
                <DataValue>{(userData.stats.level - 1) * 100 + userData.stats.xp}</DataValue>
              </div>
              
              <div>
                <DataLabel>ACHIEVEMENTS</DataLabel>
                <DataValue>
                  {userData.achievements.filter(a => a.status === 'COMPLETED').length} / {userData.achievements.length}
                </DataValue>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* DETAILED HEALTH METRICS */}
      <Panel themeMode={theme}>
        <PanelTitle>HEALTH ANALYTICS</PanelTitle>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <DataDisplay>
              <DataLabel>STEPS TODAY</DataLabel>
              <DataValue>{userData.stats.steps} / {userData.goals.steps}</DataValue>
            </DataDisplay>
            <ProgressContainer>
              <ProgressBar progress={stepsProgress} value={stepsProgress} />
            </ProgressContainer>
          </div>
          
          <div>
            <DataDisplay>
              <DataLabel>CALORIES TODAY</DataLabel>
              <DataValue>{userData.stats.calories} / {userData.goals.calories}</DataValue>
            </DataDisplay>
            <ProgressContainer>
              <ProgressBar progress={caloriesProgress} value={caloriesProgress} />
            </ProgressContainer>
          </div>
          
          <div>
            <DataDisplay>
              <DataLabel>SLEEP DURATION</DataLabel>
              <DataValue>{userData.stats.sleepDuration} / {userData.goals.sleep}h</DataValue>
            </DataDisplay>
            <ProgressContainer>
              <ProgressBar progress={sleepProgress} value={sleepProgress} />
            </ProgressContainer>
          </div>
          
          <div>
            <DataDisplay>
              <DataLabel>GYM SESSIONS</DataLabel>
              <DataValue>{userData.stats.gymSessionsThisWeek} / {userData.goals.gymWeekly}</DataValue>
            </DataDisplay>
            <ProgressContainer>
              <ProgressBar progress={gymProgress} value={gymProgress} />
            </ProgressContainer>
          </div>
        </div>
        
        <PanelTitle>WEEKLY AVERAGES</PanelTitle>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ 
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
              AVERAGE STEPS: {averageSteps}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              color: parseInt(averageSteps) >= parseInt(userData.goals.steps) ? 'var(--button-success)' : 'var(--secondary-color)'
            }}>
              {parseInt(averageSteps) >= parseInt(userData.goals.steps) 
                ? 'GOAL ACHIEVED'
                : `${Math.round((parseInt(averageSteps) / parseInt(userData.goals.steps)) * 100)}% OF GOAL`
              }
            </div>
          </div>
          
          <div style={{ 
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
              AVERAGE CALORIES: {averageCalories}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              color: parseInt(averageCalories) >= parseInt(userData.goals.calories) ? 'var(--button-success)' : 'var(--secondary-color)'
            }}>
              {parseInt(averageCalories) >= parseInt(userData.goals.calories)
                ? 'GOAL ACHIEVED'
                : `${Math.round((parseInt(averageCalories) / parseInt(userData.goals.calories)) * 100)}% OF GOAL`
              }
            </div>
          </div>
          
          <div style={{ 
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
              CURRENT WEIGHT: {userData.stats.weight}
            </div>
            <div style={{ 
              fontSize: '0.9rem',
              color: 'var(--secondary-color)'
            }}>
              MONITORING ACTIVE
            </div>
          </div>
        </div>
      </Panel>
      
      {/* PROJECTIONS */}
      <Panel themeMode={theme}>
        <PanelTitle>SYSTEM PROJECTIONS</PanelTitle>
        
        <div style={{ 
          padding: '15px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '5px',
          marginBottom: '15px',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>
            Based on current activity levels, projected outcomes:
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div>
              <DataLabel>LEVEL UP ETA:</DataLabel>
              <DataValue>
                {Math.ceil((userData.stats.maxXp - userData.stats.xp) / 15)} days
              </DataValue>
            </div>
            
            <div>
              <DataLabel>FITNESS RATING:</DataLabel>
              <DataValue>
                {gymProgress > 80 && stepsProgress > 80 ? 'EXCELLENT' : 
                  gymProgress > 50 && stepsProgress > 50 ? 'GOOD' : 'NEEDS IMPROVEMENT'}
              </DataValue>
            </div>
            
            <div>
              <DataLabel>HEALTH INDEX:</DataLabel>
              <DataValue>
                {(stepsProgress + caloriesProgress + sleepProgress + gymProgress) / 4 > 75 ? 'OPTIMAL' : 
                  (stepsProgress + caloriesProgress + sleepProgress + gymProgress) / 4 > 50 ? 'NORMAL' : 'LOW'}
              </DataValue>
            </div>
          </div>
        </div>
        
        <div style={{ 
          padding: '10px',
          border: '1px dashed var(--secondary-color)',
          borderRadius: '5px',
          fontSize: '0.9rem',
          color: 'var(--secondary-color)',
          textAlign: 'center'
        }}>
          All projections based on most recent 7-day performance metrics
        </div>
      </Panel>
    </div>
  );
};

export default StatsTab;