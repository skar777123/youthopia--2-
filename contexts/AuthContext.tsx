import * as React from 'react';
import { getInitialEvents, Event } from '../data/events.ts';
import { achievementsList, Achievement } from '../data/achievements.ts';

// --- TYPE DEFINITIONS ---

export interface PointTransaction {
    points: number;
    reason: string;
    timestamp: number;
}

export interface User {
    fullName: string;
    contact: string;
    class: string;
    stream: string;
    password?: string; // Optional as we don't want to expose it everywhere
    photo: string;
    visaPoints: number;
    spinsAvailable: number;
    achievements: string[];
    active: boolean;
    events: Event[];
    pointsHistory: PointTransaction[];
    teamName: string;
}

export interface AdminUser {
    username: string;
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    isCurrentUser: boolean;
}

export interface TeamLeaderboardEntry {
    rank: number;
    name: string;
    points: number;
    memberCount: number;
}


export interface FeedbackEntry {
    eventId: string;
    eventName: string;
    userName: string;
    userContact: string;
    feedback: string;
}

export interface DashboardStats {
    totalUsers: number;
    totalEvents: number;
    totalCompletedEvents: number;
    totalPointsAwarded: number;
}

export interface AppNotification {
    message: string;
    type: 'success' | 'info' | 'error';
}


export interface AuthContextType {
    user: User | null;
    adminUser: AdminUser | null;
    events: Event[]; // The events specific to the logged-in user
    lastEarnedAchievements: Achievement[];
    lastNotification: AppNotification | null;
    login: (contact: string, pass: string) => void;
    logout: () => void;
    register: (details: Omit<User, 'visaPoints' | 'spinsAvailable' | 'achievements' | 'active' | 'events' | 'pointsHistory' | 'teamName' | 'password'> & { password?: string }) => void;
    checkUserExists: (contact: string) => boolean;
    resetPassword: (contact: string, newPass: string) => void;
    adminLogin: (contact: string, pass: string) => void;
    adminLogout: () => void;
    registerForEvent: (eventId: string) => void;
    completeEvent: (eventId: string) => void;
    submitFeedback: (eventId: string, feedback: string) => void;
    addPoints: (points: number, reason: string) => void;
    useSpin: () => void;
    clearLastEarnedAchievements: () => void;
    clearLastNotification: () => void;
    // Admin functions
    getMasterEvents: () => Event[];
    getDashboardStats: () => DashboardStats;
    getAllUsers: () => User[];
    updateUserStatus: (contact: string, active: boolean) => void;
    getAllFeedback: () => FeedbackEntry[];
    getLeaderboardForEvent: (eventId: string) => LeaderboardEntry[];
    getOverallLeaderboard: () => LeaderboardEntry[];
    getTeamLeaderboard: () => TeamLeaderboardEntry[];
    getCurrentUserRank: () => number | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'youthopia_users';
const CURRENT_USER_KEY = 'youthopia_currentUserContact';
const CURRENT_ADMIN_KEY = 'youthopia_currentAdmin';

const getStoredUsers = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(USERS_KEY);
        return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage:", error);
        return [];
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = React.useState<User[]>(getStoredUsers);
    
    const [user, setUser] = React.useState<User | null>(() => {
        const allUsers = getStoredUsers();
        const currentUserContact = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUserContact) {
            return allUsers.find(u => u.contact === currentUserContact) || null;
        }
        return null;
    });

    const [adminUser, setAdminUser] = React.useState<AdminUser | null>(() => {
        const currentAdmin = localStorage.getItem(CURRENT_ADMIN_KEY);
        return currentAdmin ? { username: currentAdmin } : null;
    });

    const [lastEarnedAchievements, setLastEarnedAchievements] = React.useState<Achievement[]>([]);
    const [lastNotification, setLastNotification] = React.useState<AppNotification | null>(null);

    const updateUserStateAndStorage = React.useCallback((updatedUser: User) => {
        setUser(updatedUser);
        setUsers(prevUsers => {
            const newUsers = prevUsers.map(u => u.contact === updatedUser.contact ? updatedUser : u);
            localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
            return newUsers;
        });
    }, []);
    
     const checkAndAwardAchievements = React.useCallback((updatedUser: User) => {
        const newlyEarned: Achievement[] = [];
        achievementsList.forEach(achievement => {
            if (!updatedUser.achievements.includes(achievement.id) && achievement.isUnlocked(updatedUser, updatedUser.events)) {
                updatedUser.achievements.push(achievement.id);
                // Award bonus points for achievement
                const bonus = 25; // Example bonus
                updatedUser.visaPoints += bonus;
                updatedUser.pointsHistory.push({
                    points: bonus,
                    reason: `Achievement: ${achievement.name}`,
                    timestamp: Date.now(),
                });
                newlyEarned.push(achievement);
            }
        });
        if(newlyEarned.length > 0) {
            setLastEarnedAchievements(prev => [...prev, ...newlyEarned]);
        }
    }, []);


    const login = (contact: string, pass: string) => {
        const userToLogin = users.find(u => u.contact === contact);
        if (userToLogin && userToLogin.password === pass) {
            if (!userToLogin.active) {
                throw new Error("Your account has been deactivated. Please contact an administrator.");
            }
            setUser(userToLogin);
            localStorage.setItem(CURRENT_USER_KEY, contact);
        } else {
            throw new Error('Invalid credentials. Please try again.');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    };

    const register = (details: Omit<User, 'visaPoints' | 'spinsAvailable' | 'achievements' | 'active' | 'events' | 'pointsHistory' | 'teamName' | 'password'> & { password?: string }) => {
        if (checkUserExists(details.contact)) {
            throw new Error('An account with this contact number already exists.');
        }
        const newUser: User = {
            ...details,
            visaPoints: 5, // Starting points
            spinsAvailable: 0,
            achievements: [],
            active: true,
            events: getInitialEvents(),
            pointsHistory: [{ points: 5, reason: 'Welcome Bonus!', timestamp: Date.now() }],
            teamName: ['Innovators', 'Creators', 'Explorers', 'Pioneers'][Math.floor(Math.random() * 4)],
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        setUser(newUser);
        localStorage.setItem(CURRENT_USER_KEY, newUser.contact);
    };

    const checkUserExists = React.useCallback((contact: string) => users.some(u => u.contact === contact), [users]);
    
    const resetPassword = (contact: string, newPass: string) => {
        const userIndex = users.findIndex(u => u.contact === contact);
        if (userIndex === -1) {
            throw new Error("User not found.");
        }
        const updatedUsers = [...users];
        updatedUsers[userIndex].password = newPass;
        setUsers(updatedUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    }

    const adminLogin = (contact: string, pass: string) => {
         if (contact === '9321549715' && pass === 'admin') {
            const adminData = { username: 'Admin' };
            setAdminUser(adminData);
            localStorage.setItem(CURRENT_ADMIN_KEY, adminData.username);
        } else {
            throw new Error('Invalid admin credentials.');
        }
    };

    const adminLogout = () => {
        setAdminUser(null);
        localStorage.removeItem(CURRENT_ADMIN_KEY);
    };

    const registerForEvent = React.useCallback((eventId: string) => {
        if (!user) return;
        const updatedUser = { ...user };
        const event = updatedUser.events.find(e => e.id === eventId);
        if (event && !event.registered) {
            event.registered = true;
            updatedUser.visaPoints += 5;
            updatedUser.pointsHistory.push({ points: 5, reason: `Registered for ${event.name}`, timestamp: Date.now() });
            checkAndAwardAchievements(updatedUser);
            updateUserStateAndStorage(updatedUser);
            setLastNotification({ message: `Successfully Registered! +5 Points`, type: 'success' });
        }
    }, [user, checkAndAwardAchievements, updateUserStateAndStorage]);

    const completeEvent = React.useCallback((eventId: string) => {
        if (!user) return;
        const updatedUser = { ...user };
        const event = updatedUser.events.find(e => e.id === eventId);
        if (event && !event.completed) {
            event.completed = true;
            event.completedAt = Date.now();
            const bonusPoints = 5;
            const totalPoints = event.points + bonusPoints;
            updatedUser.visaPoints += totalPoints;
            updatedUser.pointsHistory.push({ points: totalPoints, reason: `Completed: ${event.name} (+${bonusPoints} Bonus)`, timestamp: Date.now() });
            updatedUser.spinsAvailable += 1; // Award one spin per completion
            checkAndAwardAchievements(updatedUser);
            updateUserStateAndStorage(updatedUser);
            setLastNotification({ message: `Event Completed! +${totalPoints} Points`, type: 'success' });
        }
    }, [user, checkAndAwardAchievements, updateUserStateAndStorage]);

    const submitFeedback = React.useCallback((eventId: string, feedback: string) => {
        if (!user) return;
        const updatedUser = { ...user };
        const event = updatedUser.events.find(e => e.id === eventId);
        if (event) {
            event.feedback = feedback;
            checkAndAwardAchievements(updatedUser);
            updateUserStateAndStorage(updatedUser);
            setLastNotification({ message: `Thank you for your feedback on ${event.name}!`, type: 'info' });
        }
    }, [user, checkAndAwardAchievements, updateUserStateAndStorage]);
    
    const addPoints = React.useCallback((points: number, reason: string) => {
        if (!user) return;
        const updatedUser = { ...user };
        updatedUser.visaPoints += points;
        updatedUser.pointsHistory.push({ points, reason, timestamp: Date.now() });
        checkAndAwardAchievements(updatedUser);
        updateUserStateAndStorage(updatedUser);
    }, [user, checkAndAwardAchievements, updateUserStateAndStorage]);
    
    const useSpin = React.useCallback(() => {
        if (!user || user.spinsAvailable <= 0) return;
        const updatedUser = { ...user, spinsAvailable: user.spinsAvailable - 1 };
        updateUserStateAndStorage(updatedUser);
    }, [user, updateUserStateAndStorage]);
    
    const clearLastEarnedAchievements = React.useCallback(() => {
        setLastEarnedAchievements([]);
    }, []);
    
    const clearLastNotification = React.useCallback(() => {
        setLastNotification(null);
    }, []);

    // Admin Getters
    const getMasterEvents = React.useCallback(() => getInitialEvents(), []);
    
    const getDashboardStats = React.useCallback((): DashboardStats => {
        const totalCompletedEvents = users.reduce((acc, u) => acc + u.events.filter(e => e.completed).length, 0);
        const totalPointsAwarded = users.reduce((acc, u) => acc + u.visaPoints, 0);
        return {
            totalUsers: users.length,
            totalEvents: getInitialEvents().length,
            totalCompletedEvents,
            totalPointsAwarded,
        };
    }, [users]);
    
    const getAllUsers = React.useCallback(() => users, [users]);
    
    const updateUserStatus = (contact: string, active: boolean) => {
        const updatedUsers = users.map(u => u.contact === contact ? { ...u, active } : u);
        setUsers(updatedUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    };

    const getAllFeedback = React.useCallback((): FeedbackEntry[] => {
        const allFeedback: FeedbackEntry[] = [];
        users.forEach(u => {
            u.events.forEach(e => {
                if (e.feedback) {
                    allFeedback.push({
                        eventId: e.id,
                        eventName: e.name,
                        userName: u.fullName,
                        userContact: u.contact,
                        feedback: e.feedback,
                    });
                }
            });
        });
        return allFeedback;
    }, [users]);
    
    const getLeaderboardForEvent = React.useCallback((eventId: string): LeaderboardEntry[] => {
        const completedParticipants = users
            .map(u => ({ user: u, event: u.events.find(e => e.id === eventId) }))
            .filter(item => item.event && item.event.completed && item.event.completedAt)
            .sort((a, b) => a.event!.completedAt! - b.event!.completedAt!);
            
        return completedParticipants.map((item, index) => ({
            rank: index + 1,
            name: item.user.fullName,
            isCurrentUser: user ? item.user.contact === user.contact : false,
        }));
    }, [users, user]);

    const getOverallLeaderboard = React.useCallback((): LeaderboardEntry[] => {
        return [...users]
            .sort((a, b) => b.visaPoints - a.visaPoints)
            .map((u, index) => ({
                rank: index + 1,
                name: u.fullName,
                isCurrentUser: user ? u.contact === user.contact : false,
            }));
    }, [users, user]);
    
    const getTeamLeaderboard = React.useCallback((): TeamLeaderboardEntry[] => {
        const teams = users.reduce<Record<string, { points: number, memberCount: number }>>((acc, u) => {
            if (!acc[u.teamName]) {
                acc[u.teamName] = { points: 0, memberCount: 0 };
            }
            acc[u.teamName].points += u.visaPoints;
            acc[u.teamName].memberCount += 1;
            return acc;
        }, {});

        return Object.entries(teams)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.points - a.points)
            .map((team, index) => ({ ...team, rank: index + 1 }));
    }, [users]);


    const getCurrentUserRank = React.useCallback((): number | null => {
        if (!user) return null;
        const leaderboard = getOverallLeaderboard();
        const userEntry = leaderboard.find(entry => entry.isCurrentUser);
        return userEntry ? userEntry.rank : null;
    }, [user, getOverallLeaderboard]);


    const value: AuthContextType = {
        user,
        adminUser,
        events: user ? user.events : [],
        lastEarnedAchievements,
        lastNotification,
        login,
        logout,
        register,
        checkUserExists,
        resetPassword,
        adminLogin,
        adminLogout,
        registerForEvent,
        completeEvent,
        submitFeedback,
        addPoints,
        useSpin,
        clearLastEarnedAchievements,
        clearLastNotification,
        getMasterEvents,
        getDashboardStats,
        getAllUsers,
        updateUserStatus,
        getAllFeedback,
        getLeaderboardForEvent,
        getOverallLeaderboard,
        getTeamLeaderboard,
        getCurrentUserRank,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};