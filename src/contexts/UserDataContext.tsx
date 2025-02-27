// src/contexts/UserDataContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

// Define all the data types
interface UserProfile {
  name: string;
  age: number | string;
}

interface Stats {
  level: number;
  xp: number;
  maxXp: number;
  sleepDuration: string;
  weight: string;
  steps: string;
  calories: string;
  screenTime: string;
  gymSession: string;
  logs: Array<{ timestamp: string; type: string; value: string }>;
  dayCompleted: boolean;
  gymSessionsThisWeek: number;
}

interface Goals {
  steps: string;
  calories: string;
  sleep: string;
  gymWeekly: string;
}

interface Achievement {
  name: string;
  status: string;
}

interface DailyAchievement {
  name: string;
  status: string;
  xp: number;
  condition: string;
}

interface HistoryEntry {
  date: string;
  sleepDuration?: string;
  weight?: string;
  steps?: string;
  calories?: string;
  screenTime?: string;
  gymSession?: string;
}

interface UserData {
  userProfile: UserProfile;
  stats: Stats;
  goals: Goals;
  achievements: Achievement[];
  dailyAchievements: DailyAchievement[];
  history: HistoryEntry[];
}

// Define the default values for user data
const defaultUserData: UserData = {
  userProfile: {
    name: "Guest",
    age: "N/A"
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
};

// Define the context type
interface UserDataContextType {
  userData: UserData;
  loading: boolean;
  saveData: () => Promise<void>;
  logStat: (statType: string, value: string) => Promise<void>;
  toggleGymSession: () => Promise<void>;
  updateUserProfile: (field: 'name' | 'age', value: string) => Promise<void>;
  updateGoal: (goalType: string, value: string) => Promise<void>;
  completeDay: () => Promise<void>;
  checkDailyAchievements: () => void;
}

// Create the context
const UserDataContext = createContext<UserDataContextType>({
  userData: defaultUserData,
  loading: true,
  saveData: async () => {},
  logStat: async () => {},
  toggleGymSession: async () => {},
  updateUserProfile: async () => {},
  updateGoal: async () => {},
  completeDay: async () => {},
  checkDailyAchievements: () => {},
});

// Create the hook to use this context
export const useUserData = () => useContext(UserDataContext);

// Provider component
export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Load user data from Firestore when auth state changes
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) {
        setUserData(defaultUserData);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const userDoc = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          setUserData(data);
          // Check for daily/weekly resets
          checkDailyReset(data);
          checkWeeklyReset(data);
        } else {
          // Initialize new user with default data
          await setDoc(userDoc, defaultUserData);
          setUserData(defaultUserData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);
  
  // Save data to Firestore
  const saveData = async (): Promise<void> => {
    if (!currentUser) return;
    
    try {
      const userDoc = doc(db, 'users', currentUser.uid);
      await setDoc(userDoc, userData, { merge: true });
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  };

  // Check if daily achievements need to reset
  const checkDailyReset = (data: UserData): void => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastDailyReset');
    
    if (lastReset !== today) {
      const updatedData = { ...data };
      updatedData.dailyAchievements.forEach(ach => ach.status = "IN PROGRESS");
      updatedData.stats.logs = [];
      updatedData.stats.dayCompleted = false;
      updatedData.stats.gymSession = "Not Completed";
      
      setUserData(updatedData);
      localStorage.setItem('lastDailyReset', today);
      saveData();
    }
  };

  // Check if weekly gym challenge needs to reset
  const checkWeeklyReset = (data: UserData): void => {
    const now = new Date();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    
    const lastWeekStartStr = localStorage.getItem('lastWeekStart');
    const lastWeekStart = lastWeekStartStr ? new Date(lastWeekStartStr) : null;
    
    if (!lastWeekStart || now.getTime() >= lastWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000) {
      const updatedData = { ...data };
      updatedData.stats.gymSessionsThisWeek = 0;
      
      setUserData(updatedData);
      localStorage.setItem('lastWeekStart', weekStart.toISOString());
      saveData();
    }
  };

  // Award XP based on activities
  const awardXp = (updatedData: UserData, params: {
    steps?: string;
    calories?: string;
    screenTime?: string;
    gymSession?: string;
    sleepDuration?: string;
  }): UserData => {
    const newData = { ...updatedData };
    let xpGain = 0;
    
    if (params.steps && parseInt(params.steps) >= parseInt(newData.goals.steps)) xpGain += 20;
    if (params.calories && parseInt(params.calories) >= parseInt(newData.goals.calories)) xpGain += 15;
    if (params.screenTime && parseFloat(params.screenTime) <= 4) xpGain += 10;
    if (params.gymSession === "Completed") xpGain += 25;
    if (params.sleepDuration) {
      const hours = parseInt(params.sleepDuration.replace('h', ''));
      const sleepGoal = parseInt(newData.goals.sleep);
      if (hours >= 7 && hours <= 9 && hours === sleepGoal) xpGain += 15;
    }

    newData.stats.xp += xpGain;
    
    // Level up if XP exceeds max
    while (newData.stats.xp >= newData.stats.maxXp) {
      newData.stats.xp -= newData.stats.maxXp;
      newData.stats.level += 1;
      newData.stats.maxXp += 50;
    }
    
    return newData;
  };

  // Log a stat
  const logStat = async (statType: string, value: string): Promise<void> => {
    if (!currentUser) return;
    
    const updatedData = { ...userData };
    
    // Safer way to update the stats property with TypeScript
    if (statType === 'sleepDuration') {
      updatedData.stats.sleepDuration = `${value}h`;
    } else if (statType === 'weight') {
      updatedData.stats.weight = value;
    } else if (statType === 'steps') {
      updatedData.stats.steps = value;
    } else if (statType === 'calories') {
      updatedData.stats.calories = value;
    } else if (statType === 'screenTime') {
      updatedData.stats.screenTime = value;
    } else if (statType === 'gymSession') {
      updatedData.stats.gymSession = value;
    }
    updatedData.stats.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      type: statType,
      value
    });
    
    if (statType === 'gymSession' && value === "Completed") {
      updatedData.stats.gymSessionsThisWeek++;
    }
    
    // Award XP
    const params: any = {};
    params[statType] = value;
    const dataWithXp = awardXp(updatedData, params);
    
    setUserData(dataWithXp);
    await saveData();
    checkDailyAchievements();
  };

  // Toggle gym session
  const toggleGymSession = async (): Promise<void> => {
    if (!currentUser) return;
    
    const updatedData = { ...userData };
    const newStatus = userData.stats.gymSession === "Completed" ? "Not Completed" : "Completed";
    updatedData.stats.gymSession = newStatus;
    
    updatedData.stats.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      type: "gymSession",
      value: newStatus
    });
    
    if (newStatus === "Completed") {
      updatedData.stats.gymSessionsThisWeek++;
    } else if (updatedData.stats.gymSessionsThisWeek > 0) {
      updatedData.stats.gymSessionsThisWeek--;
    }
    
    // Award XP
    const dataWithXp = awardXp(updatedData, { gymSession: newStatus });
    
    setUserData(dataWithXp);
    await saveData();
    checkDailyAchievements();
  };

  // Update user profile
  const updateUserProfile = async (field: 'name' | 'age', value: string): Promise<void> => {
    if (!currentUser) return;
    
    const updatedData = { ...userData };
    
    if (field === 'name' && value.trim()) {
      updatedData.userProfile.name = value.trim();
    } else if (field === 'age' && !isNaN(Number(value)) && Number(value) > 0) {
      updatedData.userProfile.age = Number(value);
    } else {
      throw new Error("Invalid input");
    }
    
    setUserData(updatedData);
    await saveData();
  };

  // Update goals
  const updateGoal = async (goalType: string, value: string): Promise<void> => {
    if (!currentUser) return;
    
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      throw new Error("Please enter a valid positive number");
    }
    
    const updatedData = { ...userData };
    
    if (goalType === 'steps' || goalType === 'calories' || goalType === 'sleep' || goalType === 'gym') {
      const goalKey = goalType === 'gym' ? 'gymWeekly' : goalType;
      updatedData.goals[goalKey as keyof Goals] = value;
      
      // Update daily achievement conditions if needed
      if (goalType === 'steps') {
        updatedData.dailyAchievements[0].condition = `steps >= ${value}`;
      } else if (goalType === 'calories') {
        updatedData.dailyAchievements[1].condition = `calories >= ${value}`;
      }
    } else {
      throw new Error("Invalid goal type");
    }
    
    setUserData(updatedData);
    await saveData();
  };

  // Complete day and save to history
  const completeDay = async (): Promise<void> => {
    if (!currentUser) return;
    
    const updatedData = { ...userData };
    const today = new Date().toDateString();
    
    const dailyEntry: HistoryEntry = {
      date: today,
      sleepDuration: updatedData.stats.sleepDuration,
      weight: updatedData.stats.weight,
      steps: updatedData.stats.steps,
      calories: updatedData.stats.calories,
      screenTime: updatedData.stats.screenTime,
      gymSession: updatedData.stats.gymSession
    };
    
    updatedData.history.push(dailyEntry);
    updatedData.stats.logs = [];
    updatedData.stats.dayCompleted = true;
    
    setUserData(updatedData);
    await saveData();
  };

  // Check achievements
  const checkDailyAchievements = (): void => {
    const updatedData = { ...userData };
    
    updatedData.dailyAchievements.forEach(ach => {
      if (ach.status === "IN PROGRESS") {
        let conditionMet = false;
        
        // Evaluate condition
        if (ach.condition.includes("steps >= ")) {
          const value = parseInt(ach.condition.split('>= ')[1]);
          conditionMet = parseInt(updatedData.stats.steps) >= value;
        } else if (ach.condition.includes("calories >= ")) {
          const value = parseInt(ach.condition.split('>= ')[1]);
          conditionMet = parseInt(updatedData.stats.calories) >= value;
        } else if (ach.condition.includes("screenTime <= ")) {
          const value = parseInt(ach.condition.split('<= ')[1]);
          conditionMet = parseFloat(updatedData.stats.screenTime) <= value;
        }
        
        if (conditionMet) {
          ach.status = "COMPLETED";
          updatedData.stats.xp += ach.xp;
        }
      }
    });
    
    setUserData(updatedData);
    saveData();
  };

  const value = {
    userData,
    loading,
    saveData,
    logStat,
    toggleGymSession,
    updateUserProfile,
    updateGoal,
    completeDay,
    checkDailyAchievements
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};