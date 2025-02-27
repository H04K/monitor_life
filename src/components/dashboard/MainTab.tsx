// src/components/dashboard/MainTab.tsx
import React, { useState } from 'react';
import { useUserData } from '../../contexts/UserDataContext';
import { useTheme } from '../../contexts/ThemeContext';

// Import CRT components
import {
  Panel,
  PanelTitle,
  CRTInput,
  CRTButton,
  DataDisplay,
  DataLabel,
  DataValue,
  ProgressContainer,
  ProgressBar,
  DataGrid,
  DataCard,
  Meter,
  MeterScale,
  MeterNeedle,
  MeterLabel
} from '../crt/CRTComponents';

const MainTab: React.FC = () => {
  const { userData, logStat, toggleGymSession, completeDay } = useUserData();
  const { theme } = useTheme();
  
  // State for input fields
  const [sleepInput, setSleepInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [stepsInput, setStepsInput] = useState('');
  const [caloriesInput, setCaloriesInput] = useState('');
  const [screenTimeInput, setScreenTimeInput] = useState('');

  // Calculate progress percentages
  const stepsProgress = (parseInt(userData.stats.steps) / parseInt(userData.goals.steps)) * 100;
  const caloriesProgress = (parseInt(userData.stats.calories) / parseInt(userData.goals.calories)) * 100;
  const sleepHours = parseFloat(userData.stats.sleepDuration.replace('h', ''));
  const sleepGoalHours = parseFloat(userData.goals.sleep);
  const sleepProgress = (sleepHours / sleepGoalHours) * 100;
  
  // Handle logging stats
  const handleLogStat = async (statType: string, value: string) => {
    try {
      if (!value) {
        alert('Please enter a value');
        return;
      }
      
      // Validate input
      if (isNaN(Number(value))) {
        alert('Please enter a valid number');
        return;
      }
      
      // Log the stat
      await logStat(statType, value);
      
      // Clear the input field
      switch(statType) {
        case 'sleepDuration':
          setSleepInput('');
          break;
        case 'weight':
          setWeightInput('');
          break;
        case 'steps':
          setStepsInput('');
          break;
        case 'calories':
          setCaloriesInput('');
          break;
        case 'screenTime':
          setScreenTimeInput('');
          break;
      }
    } catch (error) {
      console.error(`Error logging ${statType}:`, error);
      alert(`Failed to log ${statType}. Please try again.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEALTH METRICS SECTION */}
      <Panel themeMode={theme}>
        <PanelTitle>HEALTH METRICS</PanelTitle>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* Steps Meter */}
          <div>
            <DataDisplay>
              <DataLabel>STEPS</DataLabel>
              <DataValue>{userData.stats.steps} / {userData.goals.steps}</DataValue>
            </DataDisplay>
            <Meter>
              <MeterScale>
                <MeterLabel>MAX</MeterLabel>
                <MeterLabel>MIN</MeterLabel>
              </MeterScale>
              <MeterNeedle progress={stepsProgress} value={stepsProgress} />
            </Meter>
            <ProgressContainer>
              <ProgressBar progress={stepsProgress} value={stepsProgress} />
            </ProgressContainer>
          </div>
          
          {/* Calories Meter */}
          <div>
            <DataDisplay>
              <DataLabel>CALORIES</DataLabel>
              <DataValue>{userData.stats.calories} / {userData.goals.calories}</DataValue>
            </DataDisplay>
            <Meter>
              <MeterScale>
                <MeterLabel>MAX</MeterLabel>
                <MeterLabel>MIN</MeterLabel>
              </MeterScale>
              <MeterNeedle progress={caloriesProgress} value={caloriesProgress} />
            </Meter>
            <ProgressContainer>
              <ProgressBar progress={caloriesProgress} value={caloriesProgress} />
            </ProgressContainer>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <DataDisplay>
            <DataLabel>SLEEP DURATION</DataLabel>
            <DataValue>{userData.stats.sleepDuration}</DataValue>
          </DataDisplay>
          
          <DataDisplay>
            <DataLabel>WEIGHT</DataLabel>
            <DataValue>{userData.stats.weight}</DataValue>
          </DataDisplay>
          
          <DataDisplay>
            <DataLabel>SCREEN TIME</DataLabel>
            <DataValue>{userData.stats.screenTime}</DataValue>
          </DataDisplay>
          
          <DataDisplay>
            <DataLabel>GYM SESSION</DataLabel>
            <DataValue>{userData.stats.gymSession}</DataValue>
          </DataDisplay>
        </div>
      </Panel>

      {/* DATA INPUT SECTION */}
      <Panel themeMode={theme}>
        <PanelTitle>DATA INPUT CONSOLE</PanelTitle>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          <div>
            <DataLabel>SLEEP DURATION (HRS)</DataLabel>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <CRTInput
                type="text"
                placeholder="Enter hours"
                value={sleepInput}
                onChange={(e) => setSleepInput(e.target.value)}
              />
              <CRTButton onClick={() => handleLogStat('sleepDuration', sleepInput)}>LOG</CRTButton>
            </div>
          </div>
          
          <div>
            <DataLabel>WEIGHT</DataLabel>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <CRTInput
                type="text"
                placeholder="Enter weight"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
              />
              <CRTButton onClick={() => handleLogStat('weight', weightInput)}>LOG</CRTButton>
            </div>
          </div>
          
          <div>
            <DataLabel>STEPS</DataLabel>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <CRTInput
                type="text"
                placeholder="Enter steps"
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
              />
              <CRTButton onClick={() => handleLogStat('steps', stepsInput)}>LOG</CRTButton>
            </div>
          </div>
          
          <div>
            <DataLabel>CALORIES</DataLabel>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <CRTInput
                type="text"
                placeholder="Enter calories"
                value={caloriesInput}
                onChange={(e) => setCaloriesInput(e.target.value)}
              />
              <CRTButton onClick={() => handleLogStat('calories', caloriesInput)}>LOG</CRTButton>
            </div>
          </div>
          
          <div>
            <DataLabel>SCREEN TIME (HRS)</DataLabel>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <CRTInput
                type="text"
                placeholder="Enter screen time"
                value={screenTimeInput}
                onChange={(e) => setScreenTimeInput(e.target.value)}
              />
              <CRTButton onClick={() => handleLogStat('screenTime', screenTimeInput)}>LOG</CRTButton>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          <CRTButton 
            variant={userData.stats.gymSession === "Completed" ? "success" : "primary"}
            onClick={toggleGymSession}
          >
            {userData.stats.gymSession === "Completed" 
              ? "GYM SESSION COMPLETED" 
              : "MARK GYM SESSION COMPLETE"}
          </CRTButton>
          
          <CRTButton 
            variant="primary"
            onClick={completeDay}
          >
            COMPLETE DAY
          </CRTButton>
        </div>
      </Panel>

      {/* ACHIEVEMENTS SECTION */}
      <Panel themeMode={theme}>
        <PanelTitle>DAILY ACHIEVEMENTS</PanelTitle>
        
        <DataGrid>
          {userData.dailyAchievements.map((achievement, index) => (
            <DataCard 
              key={index} 
              completed={achievement.status === 'COMPLETED'}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {achievement.name}
              </div>
              
              <div style={{ 
                color: achievement.status === 'COMPLETED' ? 'var(--button-success)' : 'var(--secondary-color)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{achievement.status}</span>
                <span>+{achievement.xp} XP</span>
              </div>
              
              <div style={{ 
                fontSize: '0.8rem', 
                opacity: 0.7,
                marginTop: '5px'
              }}>
                {achievement.condition}
              </div>
            </DataCard>
          ))}
        </DataGrid>
      </Panel>
    </div>
  );
};

export default MainTab;