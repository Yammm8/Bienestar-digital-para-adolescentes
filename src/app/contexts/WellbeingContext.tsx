import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  CSSProperties,
} from "react";
import { useAuth } from "./AuthContext";
import { Activity, pickSuggestedActivity } from "../data/activities";

export interface WellbeingSettings {
  dailyLimit: number;          // minutes, 0 = no limit
  continuousThreshold: number; // minutes before pause reminder
  frictionEnabled: boolean;
  frictionIntensity: number;   // 0–100
  colorFadeEnabled: boolean;
  textFadeEnabled: boolean;
  delaysEnabled: boolean;
  remindersEnabled: boolean;
}

export interface ActiveOfflineActivity {
  activity: Activity;
  startTime: number;
  pausedAt: number | null;   // timestamp when paused, null = running
  totalPausedMs: number;     // cumulative paused milliseconds
}

interface WellbeingContextType {
  // Usage tracking
  todayMinutes: number;
  continuousMinutes: number;
  weeklyData: { day: string; minutes: number }[];
  offlineTotalMinutes: number;

  // Settings
  settings: WellbeingSettings;
  updateSettings: (partial: Partial<WellbeingSettings>) => void;

  // Computed
  frictionLevel: number;
  isAtLimit: boolean;
  frictionStyle: CSSProperties;
  progressPercent: number;

  // Break management (UC-22)
  isPaused: boolean;
  breakSecondsRemaining: number;
  startBreak: (minutes: number) => void;
  cancelBreak: () => void;

  // Alert visibility (UC-20, UC-21)
  showApproachingAlert: boolean;
  showAtLimitAlert: boolean;
  showContinuousReminder: boolean;
  dismissApproachingAlert: () => void;
  dismissAtLimitAlert: () => void;
  dismissContinuousReminder: () => void;

  // Social state
  joinedCommunities: string[];
  joinCommunity: (name: string) => void;
  leaveCommunity: (name: string) => void;
  followingUsers: string[];
  followUser: (username: string) => void;
  unfollowUser: (username: string) => void;

  // UC-24: Activity suggestion overlay
  showActivitySuggestion: boolean;
  suggestedActivity: Activity | null;
  startOfflineActivity: (activity: Activity) => void;
  dismissActivitySuggestion: () => void;

  // Active offline activity indicator
  activeOfflineActivity: ActiveOfflineActivity | null;
  activityMinimized: boolean;
  pauseOfflineActivity: () => void;
  resumeOfflineActivity: () => void;
  minimizeActivityOverlay: () => void;
  expandActivityOverlay: () => void;
  cancelOfflineActivity: () => void;

  // UC-25: Return confirmation
  showReturnConfirm: boolean;
  returnElapsedMinutes: number;
  setReturnElapsedMinutes: (m: number) => void;
  confirmOfflineActivity: (minutes: number) => void;
  declineReturnConfirm: () => void;
}

const defaultSettings: WellbeingSettings = {
  dailyLimit: 60,
  continuousThreshold: 30,
  frictionEnabled: true,
  frictionIntensity: 50,
  colorFadeEnabled: true,
  textFadeEnabled: false,
  delaysEnabled: true,
  remindersEnabled: true,
};

// Default value used when a component renders outside the provider (e.g. isolated preview).
// All mutating functions are no-ops; state values are inert defaults.
const noop = () => {};
const defaultContextValue: WellbeingContextType = {
  todayMinutes: 0,
  continuousMinutes: 0,
  weeklyData: [],
  offlineTotalMinutes: 0,
  settings: defaultSettings,
  updateSettings: noop,
  frictionLevel: 0,
  isAtLimit: false,
  frictionStyle: {},
  progressPercent: 0,
  isPaused: false,
  breakSecondsRemaining: 0,
  startBreak: noop,
  cancelBreak: noop,
  showApproachingAlert: false,
  showAtLimitAlert: false,
  showContinuousReminder: false,
  dismissApproachingAlert: noop,
  dismissAtLimitAlert: noop,
  dismissContinuousReminder: noop,
  joinedCommunities: [],
  joinCommunity: noop,
  leaveCommunity: noop,
  followingUsers: [],
  followUser: noop,
  unfollowUser: noop,
  showActivitySuggestion: false,
  suggestedActivity: null,
  startOfflineActivity: noop,
  dismissActivitySuggestion: noop,
  activeOfflineActivity: null,
  activityMinimized: false,
  pauseOfflineActivity: noop,
  resumeOfflineActivity: noop,
  minimizeActivityOverlay: noop,
  expandActivityOverlay: noop,
  cancelOfflineActivity: noop,
  showReturnConfirm: false,
  returnElapsedMinutes: 0,
  setReturnElapsedMinutes: noop,
  confirmOfflineActivity: noop,
  declineReturnConfirm: noop,
};

const WellbeingContext = createContext<WellbeingContextType>(defaultContextValue);

function getStorageKey(userId: string | null, key: string) {
  return userId ? `wb_${userId}_${key}` : `wb_${key}`;
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function loadNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored !== null ? Number(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function WellbeingProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const userId = authUser?.id ?? null;

  // Usage state
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [continuousMinutes, setContinuousMinutes] = useState(0);
  const [offlineTotalMinutes, setOfflineTotalMinutes] = useState(0);

  // Break state
  const [isPaused, setIsPaused] = useState(false);
  const [breakSecondsRemaining, setBreakSecondsRemaining] = useState(0);
  const breakEndTimeRef = useRef<number | null>(null);

  // Alert dismissal
  const [approachingDismissed, setApproachingDismissed] = useState(false);
  const [atLimitDismissed, setAtLimitDismissed] = useState(false);
  const [continuousDismissed, setContinuousDismissed] = useState(false);

  // Settings & social state — persisted in localStorage per user
  const [settings, setSettings] = useState<WellbeingSettings>(defaultSettings);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);

  // UC-24: suggestion state
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [suggestedActivity, setSuggestedActivity] = useState<Activity | null>(null);

  // UC-24/25: active offline activity
  const [activeOfflineActivity, setActiveOfflineActivity] = useState<ActiveOfflineActivity | null>(null);
  const [activityMinimized, setActivityMinimized] = useState(false);
  const activeOfflineRef = useRef<ActiveOfflineActivity | null>(null);
  const [weeklyData, setWeeklyData] = useState(
    [
      { day: "Lun", minutes: 0 },
      { day: "Mar", minutes: 0 },
      { day: "Mié", minutes: 0 },
      { day: "Jue", minutes: 0 },
      { day: "Vie", minutes: 0 },
      { day: "Sáb", minutes: 0 },
      { day: "Hoy", minutes: 0 },
    ]
  );

  // Load per-user state from localStorage
  useEffect(() => {
    const settingsKey = getStorageKey(userId, "settings");
    const communitiesKey = getStorageKey(userId, "communities");
    const followingKey = getStorageKey(userId, "following");
    const todayKey = getStorageKey(userId, "todayMinutes");
    const weeklyKey = getStorageKey(userId, "weeklyData");
    const offlineKey = getStorageKey(userId, "offlineTotalMinutes");

    setSettings(loadJSON(settingsKey, defaultSettings));
    setJoinedCommunities(loadJSON<string[]>(communitiesKey, []));
    setFollowingUsers(loadJSON<string[]>(followingKey, []));
    setTodayMinutes(loadNumber(todayKey, 0));
    setOfflineTotalMinutes(loadNumber(offlineKey, 0));
    setWeeklyData(loadJSON(weeklyKey, [
      { day: "Lun", minutes: 0 },
      { day: "Mar", minutes: 0 },
      { day: "Mié", minutes: 0 },
      { day: "Jue", minutes: 0 },
      { day: "Vie", minutes: 0 },
      { day: "Sáb", minutes: 0 },
      { day: "Hoy", minutes: 0 },
    ]));
  }, [userId]);

  // Keep ref in sync
  useEffect(() => {
    activeOfflineRef.current = activeOfflineActivity;
  }, [activeOfflineActivity]);

  // UC-25: return confirmation
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [returnElapsedMinutes, setReturnElapsedMinutes] = useState(0);

  // Minute timer: usage + continuous tracking (pauses during breaks)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTodayMinutes((prev) => prev + 1);
        setContinuousMinutes((prev) => prev + 1);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Second timer: break countdown
  useEffect(() => {
    if (!isPaused) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor(((breakEndTimeRef.current ?? 0) - Date.now()) / 1000)
      );
      setBreakSecondsRemaining(remaining);
      if (remaining === 0) {
        setIsPaused(false);
        breakEndTimeRef.current = null;
        setContinuousMinutes(0);
        setApproachingDismissed(false);
        setAtLimitDismissed(false);
        setContinuousDismissed(false);
        setSuggestionDismissed(false);
      }
    }, 1_000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // UC-25: detect tab returning to visibility
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && activeOfflineRef.current) {
        const elapsed = Math.round(
          (Date.now() - activeOfflineRef.current.startTime) / 60_000
        );
        setReturnElapsedMinutes(Math.max(1, elapsed));
        setShowReturnConfirm(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Persist settings & social state to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(getStorageKey(userId, "settings"), JSON.stringify(settings));
  }, [settings, userId]);
  useEffect(() => {
    localStorage.setItem(getStorageKey(userId, "communities"), JSON.stringify(joinedCommunities));
  }, [joinedCommunities, userId]);
  useEffect(() => {
    localStorage.setItem(getStorageKey(userId, "following"), JSON.stringify(followingUsers));
  }, [followingUsers, userId]);
  useEffect(() => {
    localStorage.setItem(getStorageKey(userId, "todayMinutes"), JSON.stringify(todayMinutes));
  }, [todayMinutes, userId]);
  useEffect(() => {
    localStorage.setItem(getStorageKey(userId, "offlineTotalMinutes"), JSON.stringify(offlineTotalMinutes));
  }, [offlineTotalMinutes, userId]);
  useEffect(() => {
    localStorage.setItem(getStorageKey(userId, "weeklyData"), JSON.stringify(weeklyData));
  }, [weeklyData, userId]);

  const updateSettings = (partial: Partial<WellbeingSettings>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  // Break actions
  const startBreak = (minutes: number) => {
    breakEndTimeRef.current = Date.now() + minutes * 60_000;
    setBreakSecondsRemaining(minutes * 60);
    setIsPaused(true);
    setContinuousMinutes(0);
    setContinuousDismissed(false);
  };

  const cancelBreak = () => {
    setIsPaused(false);
    breakEndTimeRef.current = null;
    setBreakSecondsRemaining(0);
    setContinuousMinutes(0);
  };

  // Friction
  const frictionLevel = (() => {
    if (!settings.frictionEnabled || settings.dailyLimit === 0) return 0;
    const t80 = settings.dailyLimit * 0.8;
    const t100 = settings.dailyLimit;
    if (todayMinutes <= t80) return 0;
    return Math.min(1, (todayMinutes - t80) / (t100 - t80));
  })();

  const isAtLimit = settings.dailyLimit > 0 && todayMinutes >= settings.dailyLimit;

  const progressPercent =
    settings.dailyLimit > 0 ? (todayMinutes / settings.dailyLimit) * 100 : 0;

  const frictionStyle: CSSProperties = (() => {
    if (frictionLevel === 0) return {};
    const strength = frictionLevel * (settings.frictionIntensity / 100);
    const filters: string[] = [];
    if (settings.colorFadeEnabled)
      filters.push(`saturate(${Math.max(0, 1 - strength * 0.9).toFixed(2)})`);
    if (settings.textFadeEnabled)
      filters.push(`contrast(${Math.max(0.5, 1 - strength * 0.4).toFixed(2)})`);
    return filters.length > 0
      ? { filter: filters.join(" "), transition: "filter 2s ease" }
      : {};
  })();

  // Alert visibility
  const showApproachingAlert =
    progressPercent >= 80 && progressPercent < 100 && !approachingDismissed && !isPaused;
  const showAtLimitAlert =
    progressPercent >= 100 && !atLimitDismissed && !isPaused;
  const showContinuousReminder =
    continuousMinutes >= settings.continuousThreshold &&
    !continuousDismissed &&
    !isPaused;

  // UC-24: Suggestion visibility — fires on any of the three triggers
  // Compute once; update suggestedActivity when the suggestion should appear
  const shouldShowSuggestion =
    !suggestionDismissed &&
    !activeOfflineActivity &&
    !showReturnConfirm &&
    (isPaused || frictionLevel >= 1 || isAtLimit);

  // Compute (and cache) suggested activity when trigger activates
  useEffect(() => {
    if (shouldShowSuggestion && !suggestedActivity) {
      setSuggestedActivity(pickSuggestedActivity(joinedCommunities));
    }
    if (!shouldShowSuggestion && !activeOfflineActivity) {
      setSuggestedActivity(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowSuggestion]);

  // Re-pick if communities change while not showing
  useEffect(() => {
    if (!shouldShowSuggestion) {
      setSuggestionDismissed(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinedCommunities]);

  const showActivitySuggestion = shouldShowSuggestion && suggestedActivity !== null;

  // UC-24 actions
  const startOfflineActivity = (activity: Activity) => {
    const record: ActiveOfflineActivity = {
      activity,
      startTime: Date.now(),
      pausedAt: null,
      totalPausedMs: 0,
    };
    setActiveOfflineActivity(record);
    activeOfflineRef.current = record;
    setActivityMinimized(false);
    setSuggestionDismissed(true);
    setSuggestedActivity(null);
  };

  const pauseOfflineActivity = () => {
    setActiveOfflineActivity((prev) => {
      if (!prev || prev.pausedAt !== null) return prev;
      return { ...prev, pausedAt: Date.now() };
    });
  };

  const resumeOfflineActivity = () => {
    setActiveOfflineActivity((prev) => {
      if (!prev || prev.pausedAt === null) return prev;
      const pausedDuration = Date.now() - prev.pausedAt;
      return { ...prev, pausedAt: null, totalPausedMs: prev.totalPausedMs + pausedDuration };
    });
  };

  const minimizeActivityOverlay = () => setActivityMinimized(true);
  const expandActivityOverlay = () => setActivityMinimized(false);

  const dismissActivitySuggestion = () => {
    setSuggestionDismissed(true);
    setSuggestedActivity(null);
  };

  const cancelOfflineActivity = () => {
    setActiveOfflineActivity(null);
    activeOfflineRef.current = null;
    setShowReturnConfirm(false);
  };

  // UC-25 actions
  const confirmOfflineActivity = (minutes: number) => {
    setOfflineTotalMinutes((prev) => prev + minutes);
    setActiveOfflineActivity(null);
    activeOfflineRef.current = null;
    setShowReturnConfirm(false);
  };

  const declineReturnConfirm = () => {
    setActiveOfflineActivity(null);
    activeOfflineRef.current = null;
    setShowReturnConfirm(false);
  };

  // Social helpers
  const joinCommunity = (name: string) =>
    setJoinedCommunities((prev) => (prev.includes(name) ? prev : [...prev, name]));
  const leaveCommunity = (name: string) =>
    setJoinedCommunities((prev) => prev.filter((c) => c !== name));
  const followUser = (u: string) =>
    setFollowingUsers((prev) => (prev.includes(u) ? prev : [...prev, u]));
  const unfollowUser = (u: string) =>
    setFollowingUsers((prev) => prev.filter((x) => x !== u));

  return (
    <WellbeingContext.Provider
      value={{
        todayMinutes,
        continuousMinutes,
        weeklyData,
        offlineTotalMinutes,
        settings,
        updateSettings,
        frictionLevel,
        isAtLimit,
        frictionStyle,
        progressPercent,
        isPaused,
        breakSecondsRemaining,
        startBreak,
        cancelBreak,
        showApproachingAlert,
        showAtLimitAlert,
        showContinuousReminder,
        dismissApproachingAlert: () => setApproachingDismissed(true),
        dismissAtLimitAlert: () => setAtLimitDismissed(true),
        dismissContinuousReminder: () => setContinuousDismissed(true),
        joinedCommunities,
        joinCommunity,
        leaveCommunity,
        followingUsers,
        followUser,
        unfollowUser,
        showActivitySuggestion,
        suggestedActivity,
        startOfflineActivity,
        dismissActivitySuggestion,
        activeOfflineActivity,
        activityMinimized,
        pauseOfflineActivity,
        resumeOfflineActivity,
        minimizeActivityOverlay,
        expandActivityOverlay,
        cancelOfflineActivity,
        showReturnConfirm,
        returnElapsedMinutes,
        setReturnElapsedMinutes,
        confirmOfflineActivity,
        declineReturnConfirm,
      }}
    >
      {children}
    </WellbeingContext.Provider>
  );
}

export function useWellbeing() {
  return useContext(WellbeingContext);
}
