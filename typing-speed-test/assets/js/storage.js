/**
 * Typing Speed Test - LocalStorage Manager (100% Offline)
 * Namespace: window.TypeApp.Storage
 */

window.TypeApp = window.TypeApp || {};

(function() {
  const PREFIX = 'tst_';
  const KEYS = {
    SETTINGS: PREFIX + 'settings',
    HISTORY: PREFIX + 'history',
    PB: PREFIX + 'personal_bests',
    STREAK: PREFIX + 'streak',
    LEADERBOARD: PREFIX + 'leaderboard',
    LESSONS: PREFIX + 'lessons_progress'
  };

  const DEFAULT_SETTINGS = {
    theme: 'dark',
    fontSize: 'medium', // small, medium, large, xlarge
    fontFamily: 'ui-mono', // ui-mono, consolas, cascadia, courier, monospace
    caretStyle: 'line', // line, block, underline
    caretSmooth: true,
    soundEnabled: true,
    soundVolume: 0.5,
    soundType: 'mechanical', // mechanical, typewriter, softbeep, errorbuzz
    liveWpm: true,
    liveAcc: true,
    liveTimer: true,
    virtualKeyboard: false,
    language: 'english', // english, hinglish
    difficulty: 'medium', // easy, medium, hard, code
    mode: 'time', // time, words, quote, zen, custom
    timeOption: 30, // 15, 30, 60, 120
    wordsOption: 25, // 10, 25, 50, 100
    quoteOption: 'medium', // short, medium, long
    punctuation: false,
    numbers: false,
    capitalLetters: false,
    stopOnError: false,
    backspaceMode: 'normal', // normal, none
    dailyGoalMinutes: 10,
    dailyGoalTests: 5,
    nickname: 'Typist'
  };

  // Safe localStorage accessor
  function isStorageAvailable() {
    try {
      const test = '__tst_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available, falling back to memory storage');
      return false;
    }
  }

  const hasStorage = isStorageAvailable();
  const memoryFallback = {};

  function getItem(key) {
    try {
      if (hasStorage) {
        return localStorage.getItem(key);
      }
      return memoryFallback[key] || null;
    } catch (e) {
      return memoryFallback[key] || null;
    }
  }

  function setItem(key, value) {
    try {
      if (hasStorage) {
        localStorage.setItem(key, value);
      }
      memoryFallback[key] = value;
    } catch (e) {
      memoryFallback[key] = value;
    }
  }

  function removeItem(key) {
    try {
      if (hasStorage) {
        localStorage.removeItem(key);
      }
      delete memoryFallback[key];
    } catch (e) {
      delete memoryFallback[key];
    }
  }

  const Storage = {
    /**
     * Settings
     */
    getSettings() {
      const raw = getItem(KEYS.SETTINGS);
      if (!raw) return { ...DEFAULT_SETTINGS };
      try {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (e) {
        return { ...DEFAULT_SETTINGS };
      }
    },

    saveSettings(newSettings) {
      const current = this.getSettings();
      const updated = { ...current, ...newSettings };
      setItem(KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    },

    resetSettings() {
      setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return { ...DEFAULT_SETTINGS };
    },

    /**
     * History
     */
    getHistory() {
      const raw = getItem(KEYS.HISTORY);
      if (!raw) return [];
      try {
        return JSON.parse(raw);
      } catch (e) {
        return [];
      }
    },

    saveTestResult(result) {
      const history = this.getHistory();
      const newEntry = {
        id: 'test_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        timestamp: Date.now(),
        dateStr: new Date().toISOString(),
        ...result
      };
      // Keep last 1000 tests to prevent quota exceeded
      history.unshift(newEntry);
      if (history.length > 1000) history.pop();
      setItem(KEYS.HISTORY, JSON.stringify(history));

      // Update personal bests
      const isPB = this.updatePersonalBest(newEntry);

      // Update streak and daily progress
      this.updateStreak(newEntry.durationSeconds || 0);

      // Add to local leaderboard
      this.addLeaderboardEntry({
        id: newEntry.id,
        date: newEntry.timestamp,
        mode: newEntry.mode,
        subMode: newEntry.subMode || '',
        wpm: newEntry.netWpm,
        rawWpm: newEntry.rawWpm,
        accuracy: newEntry.accuracy,
        name: this.getSettings().nickname || 'Typist'
      });

      return { entry: newEntry, isPersonalBest: isPB };
    },

    /**
     * Personal Bests
     */
    getPersonalBests() {
      const raw = getItem(KEYS.PB);
      if (!raw) return {};
      try {
        return JSON.parse(raw);
      } catch (e) {
        return {};
      }
    },

    updatePersonalBest(entry) {
      const pbs = this.getPersonalBests();
      const key = `${entry.mode}_${entry.subMode || ''}`;
      const currentBest = pbs[key];

      if (!currentBest || entry.netWpm > currentBest.wpm) {
        pbs[key] = {
          wpm: entry.netWpm,
          accuracy: entry.accuracy,
          date: entry.timestamp,
          testId: entry.id
        };
        setItem(KEYS.PB, JSON.stringify(pbs));
        return true;
      }
      return false;
    },

    /**
     * Streak & Daily Goals
     */
    getStreakData() {
      const raw = getItem(KEYS.STREAK);
      const today = new Date().toDateString();
      const defaultStreak = {
        lastActiveDate: '',
        currentStreak: 0,
        bestStreak: 0,
        todaySeconds: 0,
        todayTests: 0,
        todayDate: today
      };

      if (!raw) return defaultStreak;
      try {
        const data = JSON.parse(raw);
        // Reset daily counters if day changed
        if (data.todayDate !== today) {
          data.todayDate = today;
          data.todaySeconds = 0;
          data.todayTests = 0;
        }
        return { ...defaultStreak, ...data };
      } catch (e) {
        return defaultStreak;
      }
    },

    updateStreak(durationSeconds) {
      const data = this.getStreakData();
      const today = new Date();
      const todayStr = today.toDateString();

      data.todaySeconds += Math.round(durationSeconds);
      data.todayTests += 1;

      if (data.lastActiveDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (data.lastActiveDate === yesterdayStr) {
          data.currentStreak += 1;
        } else if (!data.lastActiveDate) {
          data.currentStreak = 1;
        } else {
          data.currentStreak = 1;
        }

        if (data.currentStreak > data.bestStreak) {
          data.bestStreak = data.currentStreak;
        }

        data.lastActiveDate = todayStr;
      }

      data.todayDate = todayStr;
      setItem(KEYS.STREAK, JSON.stringify(data));
      return data;
    },

    /**
     * Leaderboard (Local Top 20)
     */
    getLeaderboard(filterMode = null) {
      const raw = getItem(KEYS.LEADERBOARD);
      let list = [];
      if (raw) {
        try {
          list = JSON.parse(raw);
        } catch (e) {
          list = [];
        }
      }
      if (filterMode && filterMode !== 'all') {
        list = list.filter(item => item.mode === filterMode);
      }
      return list.sort((a, b) => b.wpm - a.wpm).slice(0, 20);
    },

    addLeaderboardEntry(entry) {
      const raw = getItem(KEYS.LEADERBOARD);
      let list = [];
      if (raw) {
        try {
          list = JSON.parse(raw);
        } catch (e) {
          list = [];
        }
      }
      list.push(entry);
      // Sort descending by WPM and keep top 100 overall
      list.sort((a, b) => b.wpm - a.wpm);
      if (list.length > 100) list = list.slice(0, 100);
      setItem(KEYS.LEADERBOARD, JSON.stringify(list));
    },

    clearLeaderboard() {
      setItem(KEYS.LEADERBOARD, JSON.stringify([]));
    },

    /**
     * Lessons Progress
     */
    getLessonsProgress() {
      const raw = getItem(KEYS.LESSONS);
      if (!raw) return {};
      try {
        return JSON.parse(raw);
      } catch (e) {
        return {};
      }
    },

    saveLessonResult(lessonId, stats) {
      const progress = this.getLessonsProgress();
      const existing = progress[lessonId] || { passed: false, bestWpm: 0, bestAcc: 0, attempts: 0 };
      
      const passed = stats.accuracy >= stats.targetAccuracy && stats.wpm >= stats.targetWpm;
      progress[lessonId] = {
        passed: existing.passed || passed,
        bestWpm: Math.max(existing.bestWpm, stats.wpm),
        bestAcc: Math.max(existing.bestAcc, stats.accuracy),
        attempts: existing.attempts + 1,
        lastAttempt: Date.now()
      };
      setItem(KEYS.LESSONS, JSON.stringify(progress));
      return progress[lessonId];
    },

    /**
     * Export / Import / Clear All
     */
    exportAllData() {
      return {
        exportDate: new Date().toISOString(),
        version: '1.0',
        settings: this.getSettings(),
        history: this.getHistory(),
        personalBests: this.getPersonalBests(),
        streak: this.getStreakData(),
        leaderboard: this.getLeaderboard(),
        lessons: this.getLessonsProgress()
      };
    },

    importAllData(imported) {
      if (!imported || typeof imported !== 'object') {
        throw new Error('Invalid backup file format');
      }
      if (imported.settings) setItem(KEYS.SETTINGS, JSON.stringify(imported.settings));
      if (imported.history) setItem(KEYS.HISTORY, JSON.stringify(imported.history));
      if (imported.personalBests) setItem(KEYS.PB, JSON.stringify(imported.personalBests));
      if (imported.streak) setItem(KEYS.STREAK, JSON.stringify(imported.streak));
      if (imported.leaderboard) setItem(KEYS.LEADERBOARD, JSON.stringify(imported.leaderboard));
      if (imported.lessons) setItem(KEYS.LESSONS, JSON.stringify(imported.lessons));
      return true;
    },

    clearAllData() {
      removeItem(KEYS.SETTINGS);
      removeItem(KEYS.HISTORY);
      removeItem(KEYS.PB);
      removeItem(KEYS.STREAK);
      removeItem(KEYS.LEADERBOARD);
      removeItem(KEYS.LESSONS);
      return true;
    }
  };

  window.TypeApp.Storage = Storage;
})();
