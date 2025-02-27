// src/components/dashboard/SettingsTab.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../contexts/UserDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

// Import CRT components
import {
  Panel,
  PanelTitle,
  DataDisplay,
  DataLabel,
  DataValue,
  CRTInput,
  CRTButton,
  LED,
  Switch
} from '../crt/CRTComponents';

const SettingsTab: React.FC = () => {
  const { userData, updateUserProfile, updateGoal } = useUserData();
  const { logout } = useAuth();
  const { theme, colorScheme, toggleTheme, changeColorScheme } = useTheme();
  const navigate = useNavigate();
  
  // Form states
  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [stepsGoalInput, setStepsGoalInput] = useState('');
  const [caloriesGoalInput, setCaloriesGoalInput] = useState('');
  const [sleepGoalInput, setSleepGoalInput] = useState('');
  const [gymGoalInput, setGymGoalInput] = useState('');
  
  // Error and success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState<'profile' | 'goals' | 'system'>('profile');
  
  // Get current week range
  const getWeekRangeText = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Monday as week start
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const formatDate = (date: Date) => {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };
  
  // Handle profile updates
  const handleUpdateProfile = async (field: 'name' | 'age') => {
    setError('');
    setSuccess('');
    
    try {
      const value = field === 'name' ? nameInput : ageInput;
      
      if (!value) {
        setError(`Please enter a valid ${field}`);
        return;
      }
      
      await updateUserProfile(field, value);
      
      // Clear input
      if (field === 'name') {
        setNameInput('');
      } else {
        setAgeInput('');
      }
      
      setSuccess(`${field.toUpperCase()} updated successfully.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || `Failed to update ${field}`);
    }
  };
  
  // Handle goal updates
  const handleUpdateGoal = async (goalType: string) => {
    setError('');
    setSuccess('');
    
    try {
      let value = '';
      
      switch (goalType) {
        case 'steps':
          value = stepsGoalInput;
          break;
        case 'calories':
          value = caloriesGoalInput;
          break;
        case 'sleep':
          value = sleepGoalInput;
          break;
        case 'gym':
          value = gymGoalInput;
          break;
      }
      
      if (!value || isNaN(Number(value)) || Number(value) <= 0) {
        setError(`Please enter a valid positive number for ${goalType} goal`);
        return;
      }
      
      await updateGoal(goalType, value);
      
      // Clear input
      switch (goalType) {
        case 'steps':
          setStepsGoalInput('');
          break;
        case 'calories':
          setCaloriesGoalInput('');
          break;
        case 'sleep':
          setSleepGoalInput('');
          break;
        case 'gym':
          setGymGoalInput('');
          break;
      }
      
      setSuccess(`${goalType.toUpperCase()} goal updated successfully.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || `Failed to update ${goalType} goal`);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error: any) {
      setError('Failed to log out');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* SETTINGS NAVIGATION */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '5px',
        marginBottom: '5px'
      }}>
        <CRTButton 
          onClick={() => setActiveSection('profile')}
          style={{ 
            opacity: activeSection === 'profile' ? 1 : 0.7,
            backgroundColor: activeSection === 'profile' ? 'var(--primary-color)' : 'rgba(0,0,0,0.5)',
            color: activeSection === 'profile' ? '#000' : 'var(--primary-color)',
            border: '1px solid var(--primary-color)'
          }}
        >
          PROFILE
        </CRTButton>
        
        <CRTButton 
          onClick={() => setActiveSection('goals')}
          style={{ 
            opacity: activeSection === 'goals' ? 1 : 0.7,
            backgroundColor: activeSection === 'goals' ? 'var(--primary-color)' : 'rgba(0,0,0,0.5)',
            color: activeSection === 'goals' ? '#000' : 'var(--primary-color)',
            border: '1px solid var(--primary-color)'
          }}
        >
          GOALS
        </CRTButton>
        
        <CRTButton 
          onClick={() => setActiveSection('system')}
          style={{ 
            opacity: activeSection === 'system' ? 1 : 0.7,
            backgroundColor: activeSection === 'system' ? 'var(--primary-color)' : 'rgba(0,0,0,0.5)',
            color: activeSection === 'system' ? '#000' : 'var(--primary-color)',
            border: '1px solid var(--primary-color)'
          }}
        >
          SYSTEM
        </CRTButton>
      </div>
      
      {/* SUCCESS/ERROR MESSAGES */}
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          border: '1px solid var(--button-warning)',
          borderRadius: '5px',
          color: 'var(--button-warning)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem'
        }}>
          ERROR: {error}
        </div>
      )}
      
      {success && (
        <div style={{
          padding: '10px',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          border: '1px solid var(--button-success)',
          borderRadius: '5px',
          color: 'var(--button-success)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem'
        }}>
          SUCCESS: {success}
        </div>
      )}

      {/* PROFILE SECTION */}
      {activeSection === 'profile' && (
        <Panel themeMode={theme}>
          <PanelTitle>USER PROFILE</PanelTitle>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '15px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '5px'
            }}>
              <DataDisplay>
                <DataLabel>CURRENT NAME</DataLabel>
                <DataValue>{userData.userProfile.name}</DataValue>
              </DataDisplay>
              
              <div style={{ marginTop: '10px' }}>
                <CRTInput
                  type="text"
                  placeholder="Enter new name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
                <div style={{ marginTop: '10px' }}>
                  <CRTButton onClick={() => handleUpdateProfile('name')}>
                    UPDATE NAME
                  </CRTButton>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: '15px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '5px'
            }}>
              <DataDisplay>
                <DataLabel>CURRENT AGE</DataLabel>
                <DataValue>{userData.userProfile.age}</DataValue>
              </DataDisplay>
              
              <div style={{ marginTop: '10px' }}>
                <CRTInput
                  type="number"
                  placeholder="Enter new age"
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  min="1"
                />
                <div style={{ marginTop: '10px' }}>
                  <CRTButton onClick={() => handleUpdateProfile('age')}>
                    UPDATE AGE
                  </CRTButton>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '5px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--secondary-color)',
            textAlign: 'center'
          }}>
            Your profile information helps personalize health recommendations.
          </div>
        </Panel>
      )}
      
      {/* GOALS SECTION */}
      {activeSection === 'goals' && (
        <Panel themeMode={theme}>
          <PanelTitle>HEALTH GOALS</PanelTitle>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '15px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '5px'
            }}>
              <DataDisplay>
                <DataLabel>STEPS GOAL</DataLabel>
                <DataValue>{userData.goals.steps}</DataValue>
              </DataDisplay>
              
              <div style={{ marginTop: '10px' }}>
                <CRTInput
                  type="number"
                  placeholder="Enter new steps goal"
                  value={stepsGoalInput}
                  onChange={(e) => setStepsGoalInput(e.target.value)}
                  min="1"
                />
                <div style={{ marginTop: '10px' }}>
                  <CRTButton onClick={() => handleUpdateGoal('steps')}>
                    UPDATE STEPS GOAL
                  </CRTButton>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: '15px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '5px'
            }}>
              <DataDisplay>
                <DataLabel>CALORIES GOAL</DataLabel>
                <DataValue>{userData.goals.calories}</DataValue>
              </DataDisplay>
              
              <div style={{ marginTop: '10px' }}>
                <CRTInput
                  type="number"
                  placeholder="Enter new calories goal"
                  value={caloriesGoalInput}
                  onChange={(e) => setCaloriesGoalInput(e.target.value)}
                  min="1"
                />
                <div style={{ marginTop: '10px' }}>
                  <CRTButton onClick={() => handleUpdateGoal('calories')}>
                    UPDATE CALORIES GOAL
                  </CRTButton>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '15px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '5px'
            }}>
              <DataDisplay>
                <DataLabel>SLEEP GOAL (HOURS)</DataLabel>
                <DataValue>{userData.goals.sleep}</DataValue>
              </DataDisplay>
              
              <div style={{ marginTop: '10px' }}>
                <CRTInput
                  type="number"
                  placeholder="Enter new sleep goal (hrs)"
                  value={sleepGoalInput}
                  onChange={(e) => setSleepGoalInput(e.target.value)}
                  min="1"
                  max="24"
                />
                <div style={{ marginTop: '10px' }}>
                  <CRTButton onClick={() => handleUpdateGoal('sleep')}>
                    UPDATE SLEEP GOAL
                  </CRTButton>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: '15px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '5px'
            }}>
              <DataDisplay>
                <DataLabel>WEEKLY GYM SESSIONS</DataLabel>
                <DataValue>{userData.goals.gymWeekly}</DataValue>
              </DataDisplay>
              
              <div style={{ marginTop: '10px' }}>
                <CRTInput
                  type="number"
                  placeholder="Enter new gym sessions goal"
                  value={gymGoalInput}
                  onChange={(e) => setGymGoalInput(e.target.value)}
                  min="1"
                  max="7"
                />
                <div style={{ marginTop: '10px' }}>
                  <CRTButton onClick={() => handleUpdateGoal('gym')}>
                    UPDATE GYM GOAL
                  </CRTButton>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '5px',
            border: '1px dashed var(--console-border)'
          }}>
            <DataDisplay>
              <DataLabel>WEEKLY GYM CHALLENGE</DataLabel>
              <DataValue>
                {userData.stats.gymSessionsThisWeek}/{userData.goals.gymWeekly} sessions
              </DataValue>
            </DataDisplay>
            <div style={{ 
              marginTop: '10px',
              fontSize: '0.9rem',
              color: 'var(--secondary-color)',
              textAlign: 'center'
            }}>
              Current Week: {getWeekRangeText()}
            </div>
          </div>
        </Panel>
      )}
      
      {/* SYSTEM SECTION */}
      {activeSection === 'system' && (
        <Panel themeMode={theme}>
          <PanelTitle>SYSTEM SETTINGS</PanelTitle>
          
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <DataLabel>DISPLAY SETTINGS</DataLabel>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              margin: '10px 0',
              padding: '10px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '5px'
            }}>
              <div>
                <span style={{ color: 'var(--primary-color)' }}>THEME</span>
                <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                  {theme === 'dark' ? 'DARK' : 'LIGHT'}
                </span>
              </div>
              <Switch on={theme === 'dark'} onClick={toggleTheme} />
            </div>
            
            <div style={{ 
              margin: '15px 0',
              padding: '10px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '5px'
            }}>
              <div style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>
                COLOR SCHEME
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <CRTButton 
                  onClick={() => changeColorScheme('green')}
                  style={{ 
                    backgroundColor: 'var(--green-primary)', 
                    opacity: colorScheme === 'green' ? 1 : 0.5,
                    flex: 1
                  }}
                >
                  GREEN
                </CRTButton>
                <CRTButton 
                  onClick={() => changeColorScheme('amber')}
                  style={{ 
                    backgroundColor: 'var(--amber-primary)', 
                    opacity: colorScheme === 'amber' ? 1 : 0.5,
                    flex: 1
                  }}
                >
                  AMBER
                </CRTButton>
                <CRTButton 
                  onClick={() => changeColorScheme('blue')}
                  style={{ 
                    backgroundColor: 'var(--blue-primary)', 
                    opacity: colorScheme === 'blue' ? 1 : 0.5,
                    flex: 1
                  }}
                >
                  BLUE
                </CRTButton>
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <DataLabel>SYSTEM STATUS</DataLabel>
            
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              marginTop: '15px'
            }}>
              <div style={{
                flex: '1 1 200px',
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <LED active={true} color="var(--button-success)" />
                <span style={{ color: 'var(--button-success)' }}>DATABASE CONNECTED</span>
              </div>
              
              <div style={{
                flex: '1 1 200px',
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <LED active={true} color="var(--button-success)" />
                <span style={{ color: 'var(--button-success)' }}>USER AUTHENTICATED</span>
              </div>
              
              <div style={{
                flex: '1 1 200px',
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <LED active={true} />
                <span>SYSTEM VERSION: 1.0</span>
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '5px'
          }}>
            <DataLabel>ACCOUNT MANAGEMENT</DataLabel>
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <CRTButton 
                variant="warning" 
                onClick={handleLogout}
                style={{ padding: '12px 20px' }}
              >
                LOGOUT
              </CRTButton>
            </div>
            
            <div style={{ 
              marginTop: '15px',
              padding: '10px',
              border: '1px dashed var(--button-warning)',
              borderRadius: '5px',
              color: 'var(--secondary-color)',
              fontSize: '0.8rem',
              textAlign: 'center'
            }}>
              WARNING: Logging out will terminate your current session
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
};

export default SettingsTab;