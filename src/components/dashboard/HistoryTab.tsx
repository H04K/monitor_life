// src/components/dashboard/HistoryTab.tsx
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
  CRTButton,
  Blinker
} from '../crt/CRTComponents';

// Interface for our sorted history
interface HistoryGroup {
  date: string;
  entries: Array<any>;
}

const HistoryTab: React.FC = () => {
  const { userData } = useUserData();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  
  // Include today's data if it's completed
  const allHistory = [...userData.history];
  const today = new Date().toDateString();
  
  if (userData.stats.dayCompleted) {
    const todayExists = allHistory.some(entry => entry.date === today);
    
    if (!todayExists) {
      allHistory.unshift({
        date: today,
        sleepDuration: userData.stats.sleepDuration,
        weight: userData.stats.weight,
        steps: userData.stats.steps,
        calories: userData.stats.calories,
        screenTime: userData.stats.screenTime,
        gymSession: userData.stats.gymSession
      });
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Group history entries by date (in case there are multiple per day)
  const groupHistoryByDate = (): HistoryGroup[] => {
    const groups: { [key: string]: any[] } = {};
    
    allHistory.forEach(entry => {
      if (!groups[entry.date]) {
        groups[entry.date] = [];
      }
      groups[entry.date].push(entry);
    });
    
    // Convert to array and sort by date (newest first)
    return Object.keys(groups)
      .map(date => ({ date, entries: groups[date] }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const historyGroups = groupHistoryByDate();
  
  // Get selected entry details
  const getSelectedEntry = () => {
    if (!selectedDate) return null;
    return historyGroups.find(group => group.date === selectedDate)?.entries[0] || null;
  };
  
  const selectedEntry = getSelectedEntry();
  
  // Toggle detail view
  const handleEntrySelect = (date: string) => {
    setSelectedDate(date);
    setViewMode('detail');
  };
  
  // Return to list view
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDate(null);
  };
  
  // Calculate trend for a given metric
  const calculateTrend = (metric: string) => {
    if (allHistory.length < 2) return "NO DATA";
    
    const latestValue = 
      parseFloat(allHistory[0][metric as keyof typeof allHistory[0]] as string || '0');
    const previousValue = 
      parseFloat(allHistory[1][metric as keyof typeof allHistory[1]] as string || '0');
    
    if (isNaN(latestValue) || isNaN(previousValue)) return "NO DATA";
    
    const diff = latestValue - previousValue;
    if (diff > 0) return `▲ ${diff.toFixed(1)}`;
    if (diff < 0) return `▼ ${Math.abs(diff).toFixed(1)}`;
    return "─ 0.0";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HISTORY SUMMARY */}
      <Panel themeMode={theme}>
        <PanelTitle>DATA TIMELINE</PanelTitle>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '5px'
        }}>
          <div>
            <DataLabel>TOTAL ENTRIES</DataLabel>
            <DataValue>{allHistory.length}</DataValue>
          </div>
          
          <div>
            <DataLabel>TRACKING SINCE</DataLabel>
            <DataValue>
              {allHistory.length > 0 
                ? formatDate(allHistory[allHistory.length - 1].date)
                : "No data available"}
            </DataValue>
          </div>
          
          <div>
            <DataLabel>STATUS</DataLabel>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              color: 'var(--primary-color)'
            }}>
              SYSTEM ACTIVE <Blinker />
            </div>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          // List view showing all history entries
          <div>
            {historyGroups.length > 0 ? (
              historyGroups.map((group) => (
                <div 
                  key={group.date}
                  style={{
                    margin: '10px 0',
                    padding: '15px',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    border: '1px solid var(--console-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => handleEntrySelect(group.date)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      fontSize: '1.1rem',
                      color: 'var(--primary-color)',
                      fontWeight: 'bold'
                    }}>
                      {formatDate(group.date)}
                    </div>
                    
                    <div style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: 'var(--secondary-color)'
                    }}>
                      {group.date === today ? 'TODAY' : ''}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '10px'
                  }}>
                    {group.entries[0].steps && (
                      <div>
                        <DataLabel>STEPS</DataLabel>
                        <DataValue>{group.entries[0].steps}</DataValue>
                      </div>
                    )}
                    
                    {group.entries[0].calories && (
                      <div>
                        <DataLabel>CALORIES</DataLabel>
                        <DataValue>{group.entries[0].calories}</DataValue>
                      </div>
                    )}
                    
                    {group.entries[0].sleepDuration && (
                      <div>
                        <DataLabel>SLEEP</DataLabel>
                        <DataValue>{group.entries[0].sleepDuration}</DataValue>
                      </div>
                    )}
                  </div>
                  
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    fontSize: '0.8rem',
                    color: 'var(--secondary-color)',
                    opacity: 0.7
                  }}>
                    CLICK FOR DETAILS
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: 'var(--secondary-color)',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '5px'
              }}>
                No history available. Complete a day to start tracking progress.
              </div>
            )}
          </div>
        ) : (
          // Detail view showing a single entry
          <div>
            {selectedEntry && (
              <div style={{
                padding: '20px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '5px',
                border: '1px solid var(--console-border)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  borderBottom: '1px solid var(--console-border)',
                  paddingBottom: '10px'
                }}>
                  <div style={{
                    fontSize: '1.2rem',
                    color: 'var(--primary-color)',
                    fontWeight: 'bold'
                  }}>
                    {formatDate(selectedEntry.date)}
                  </div>
                  
                  <CRTButton onClick={handleBackToList}>
                    BACK TO LIST
                  </CRTButton>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '5px'
                  }}>
                    <DataDisplay>
                      <DataLabel>STEPS</DataLabel>
                      <DataValue>{selectedEntry.steps || 'N/A'}</DataValue>
                    </DataDisplay>
                    
                    <div style={{
                      marginTop: '5px',
                      fontSize: '0.8rem',
                      color: selectedEntry.date !== today ? 'var(--secondary-color)' : 'var(--primary-color)'
                    }}>
                      {selectedEntry.date !== today && calculateTrend('steps')}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '5px'
                  }}>
                    <DataDisplay>
                      <DataLabel>CALORIES</DataLabel>
                      <DataValue>{selectedEntry.calories || 'N/A'}</DataValue>
                    </DataDisplay>
                    
                    <div style={{
                      marginTop: '5px',
                      fontSize: '0.8rem',
                      color: selectedEntry.date !== today ? 'var(--secondary-color)' : 'var(--primary-color)'
                    }}>
                      {selectedEntry.date !== today && calculateTrend('calories')}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '5px'
                  }}>
                    <DataDisplay>
                      <DataLabel>SLEEP DURATION</DataLabel>
                      <DataValue>{selectedEntry.sleepDuration || 'N/A'}</DataValue>
                    </DataDisplay>
                    
                    <div style={{
                      marginTop: '5px',
                      fontSize: '0.8rem',
                      color: selectedEntry.date !== today ? 'var(--secondary-color)' : 'var(--primary-color)'
                    }}>
                      {selectedEntry.date !== today && calculateTrend('sleepDuration')}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px'
                }}>
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '5px'
                  }}>
                    <DataDisplay>
                      <DataLabel>WEIGHT</DataLabel>
                      <DataValue>{selectedEntry.weight || 'N/A'}</DataValue>
                    </DataDisplay>
                    
                    <div style={{
                      marginTop: '5px',
                      fontSize: '0.8rem',
                      color: selectedEntry.date !== today ? 'var(--secondary-color)' : 'var(--primary-color)'
                    }}>
                      {selectedEntry.date !== today && calculateTrend('weight')}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '5px'
                  }}>
                    <DataDisplay>
                      <DataLabel>SCREEN TIME</DataLabel>
                      <DataValue>{selectedEntry.screenTime || 'N/A'}</DataValue>
                    </DataDisplay>
                    
                    <div style={{
                      marginTop: '5px',
                      fontSize: '0.8rem',
                      color: selectedEntry.date !== today ? 'var(--secondary-color)' : 'var(--primary-color)'
                    }}>
                      {selectedEntry.date !== today && calculateTrend('screenTime')}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '5px'
                  }}>
                    <DataDisplay>
                      <DataLabel>GYM SESSION</DataLabel>
                      <DataValue>{selectedEntry.gymSession || 'N/A'}</DataValue>
                    </DataDisplay>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Panel>
      
      {/* DATA INSIGHTS */}
      {allHistory.length > 0 && (
        <Panel themeMode={theme}>
          <PanelTitle>DATA INSIGHTS</PanelTitle>
          
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '5px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--secondary-color)'
          }}>
            <div style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>
              SYSTEM ANALYSIS:
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              Based on your {allHistory.length} days of historical data, the following patterns have been observed:
            </div>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px',
              marginTop: '15px'
            }}>
              <div style={{
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '5px'
              }}>
                <div style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>
                  ACTIVITY PATTERN
                </div>
                <div>
                  {allHistory.length > 3 
                    ? "Consistent activity levels detected."
                    : "Insufficient data for pattern analysis."}
                </div>
              </div>
              
              <div style={{
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '5px'
              }}>
                <div style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>
                  SLEEP QUALITY
                </div>
                <div>
                  {allHistory.length > 3 
                    ? "Sleep duration is within optimal range."
                    : "Monitoring sleep patterns."}
                </div>
              </div>
              
              <div style={{
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '5px'
              }}>
                <div style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>
                  FITNESS PROGRESS
                </div>
                <div>
                  {allHistory.filter(entry => entry.gymSession === "Completed").length > 2
                    ? "Regular fitness activity detected."
                    : "Fitness activity below optimal level."}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
};

export default HistoryTab;