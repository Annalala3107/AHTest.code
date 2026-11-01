/**
 * Streak Management Service
 * Manages daily streak tracking, activity recording, and streak statistics in localStorage.
 */

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDates: string[]; // List of YYYY-MM-DD
  freezeDays: number;
  completedToday: boolean;
}

const STREAK_STORAGE_KEY = 'ahtest_streak_state';

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current streak state from localStorage or initialize defaults
 */
export function getStreakState(): StreakState {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      // Default initial state: 7 days streak with today active
      const pastDates: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        pastDates.push(`${y}-${m}-${day}`);
      }

      const initialState: StreakState = {
        currentStreak: 7,
        longestStreak: 42,
        lastActiveDate: today,
        activeDates: pastDates,
        freezeDays: 2,
        completedToday: true
      };
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(initialState));
      return initialState;
    }

    const state: StreakState = JSON.parse(raw);
    const completedToday = state.lastActiveDate === today;

    // Check if streak was broken (last active date was before yesterday)
    let currentStreak = state.currentStreak;
    if (state.lastActiveDate !== today && state.lastActiveDate !== yesterday) {
      if (state.freezeDays > 0) {
        // Automatically consume a freeze day to preserve streak
        state.freezeDays -= 1;
      } else {
        // Reset streak
        currentStreak = 0;
      }
    }

    return {
      ...state,
      currentStreak,
      completedToday
    };
  } catch {
    return {
      currentStreak: 7,
      longestStreak: 42,
      lastActiveDate: today,
      activeDates: [today],
      freezeDays: 2,
      completedToday: true
    };
  }
}

/**
 * Record a successful coding activity (e.g. solved problem or passed test)
 */
export function recordStreakActivity(): StreakState {
  const state = getStreakState();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (state.lastActiveDate === today) {
    // Already recorded today
    return state;
  }

  let newStreak = state.currentStreak;
  if (state.lastActiveDate === yesterday || state.currentStreak === 0) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  const newLongest = Math.max(state.longestStreak, newStreak);
  const activeDates = Array.from(new Set([...state.activeDates, today]));

  const updated: StreakState = {
    ...state,
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: today,
    activeDates,
    completedToday: true
  };

  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ahtest-streak-updated', { detail: updated }));
  } catch (e) {
    console.warn('Failed to save streak state:', e);
  }

  return updated;
}

/**
 * Get 7-day activity status for current week (Mon to Sun)
 */
export function getWeeklyActivity(): { dayName: string; dateStr: string; isActive: boolean; isToday: boolean }[] {
  const state = getStreakState();
  const today = getTodayString();
  const d = new Date();
  
  // Find Monday of current week
  const currentDay = d.getDay(); // 0 is Sun, 1 is Mon...
  const distanceToMonday = (currentDay + 6) % 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - distanceToMonday);

  const daysShort = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const weekData = [];

  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    weekData.push({
      dayName: daysShort[i],
      dateStr,
      isActive: state.activeDates.includes(dateStr),
      isToday: dateStr === today
    });
  }

  return weekData;
}
