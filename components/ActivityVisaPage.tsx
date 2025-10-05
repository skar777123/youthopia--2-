import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiUser, FiAward, FiTrendingUp, FiGift, FiMap, FiClock, FiHelpCircle } from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';

import { useAuth } from '../contexts/AuthContext.tsx';
import AchievementToast from './AchievementToast.tsx';
import SkeletonLoader from './SkeletonLoader.tsx';
import NotificationToast from './NotificationToast.tsx';

// Passport Pages
import ProfilePage from './passport-pages/ProfilePage.tsx';
import VisaGridPage from './passport-pages/VisaGridPage.tsx';
import LeaderboardPage from './passport-pages/LeaderboardPage.tsx';
import SummaryPage from './passport-pages/SummaryPage.tsx';
import VisaPointsPage from './passport-pages/VisaPointsPage.tsx';
import MapPage from './passport-pages/MapPage.tsx';
import SchedulePage from './passport-pages/SchedulePage.tsx';
import GuidancePage from './passport-pages/GuidancePage.tsx';
import PrizesPage from './passport-pages/PrizesPage.tsx';

type Page = 'summary' | 'visa' | 'leaderboard' | 'prizes' | 'points' | 'profile' | 'schedule' | 'map' | 'guidance';

const pageComponents: Record<Page, React.FC<any>> = {
    summary: SummaryPage,
    visa: VisaGridPage,
    leaderboard: LeaderboardPage,
    prizes: PrizesPage,
    points: VisaPointsPage,
    profile: ProfilePage,
    schedule: SchedulePage,
    map: MapPage,
    guidance: GuidancePage,
};

const navItems = [
    { id: 'profile', icon: FiUser, label: 'Profile' },
    { id: 'visa', icon: FiGrid, label: 'VISA' },
    { id: 'prizes', icon: FaTrophy, label: 'Prizes' },
    { id: 'leaderboard', icon: FiAward, label: 'Ranks' },
    { id: 'schedule', icon: FiClock, label: 'Schedule' },
    { id: 'map', icon: FiMap, label: 'Map' },
    { id: 'points', icon: FiGift, label: 'Points' },
    { id: 'summary', icon: FiTrendingUp, label: 'Summary' },
    { id: 'guidance', icon: FiHelpCircle, label: 'Help' },
];

const pageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '20%' : '-20%',
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '20%' : '-20%',
        opacity: 0,
    }),
};

const PassportSkeleton: React.FC = () => (
    <div className="w-full max-w-6xl mx-auto flex-grow flex flex-col">
        <div className="flex-grow flex bg-brand-passport-bg dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6">
            <div className="w-full h-full">
                <SkeletonLoader className="h-8 w-1/3 rounded-md mb-6" />
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <SkeletonLoader className="h-20 rounded-lg" />
                    <SkeletonLoader className="h-20 rounded-lg" />
                </div>
                <SkeletonLoader className="h-6 w-1/4 rounded-md mb-4" />
                <SkeletonLoader className="h-40 w-full rounded-lg" />
            </div>
        </div>
        <nav className="mt-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
             <div className="flex justify-start items-center overflow-x-auto flex-nowrap passport-scrollbar pb-1 -mb-1 px-2 space-x-2">
                {navItems.map(item => (
                    <div key={item.id} className="flex flex-col items-center justify-center w-14 h-14 min-w-[3.5rem]">
                        <SkeletonLoader className="w-6 h-6 rounded-full mb-1" />
                        <SkeletonLoader className="w-10 h-3 rounded-sm" />
                    </div>
                ))}
            </div>
        </nav>
    </div>
);

const ActivityVisaPage: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    
    const locationState = location.state as { highlightEventId?: string; } | undefined;
    
    const [pageIndex, setPageIndex] = React.useState(locationState?.highlightEventId ? 1 : 0);
    const [direction, setDirection] = React.useState(0);
    
    const changePage = (newIndex: number) => {
        if (newIndex === pageIndex) return;
        setDirection(newIndex > pageIndex ? 1 : -1);
        setPageIndex(newIndex);
    };

    if (!user) {
        return (
            <div className="bg-brand-bg dark:bg-brand-black min-h-[calc(100vh-80px)] py-8 px-4 flex flex-col items-center">
                <PassportSkeleton />
            </div>
        );
    }

    const activePageId = navItems[pageIndex].id as Page;
    const CurrentPage = pageComponents[activePageId];
    
    return (
        <div className="bg-brand-bg dark:bg-brand-black min-h-[calc(100vh-80px)] py-8 px-4 flex flex-col items-center">
            <AchievementToast />
            <NotificationToast />
            <div className="w-full max-w-6xl mx-auto flex-grow flex flex-col">
                <div 
                    className="flex-grow flex bg-brand-passport-bg dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                    style={{ 
                        backgroundImage: `
                            radial-gradient(circle at top left, rgba(10, 42, 71, 0.1) 0%, transparent 30%),
                            radial-gradient(circle at bottom right, rgba(10, 42, 71, 0.1) 0%, transparent 30%)
                        `,
                    }}
                >
                    <main className="flex-grow w-full h-full relative">
                        <AnimatePresence initial={false} mode="wait" custom={direction}>
                            <motion.div
                                key={pageIndex}
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="w-full h-full absolute"
                            >
                                {activePageId === 'summary' ? 
                                    <CurrentPage changePage={changePage} /> :
                                    <CurrentPage highlightEventId={locationState?.highlightEventId} />
                                }
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                <nav className="mt-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
                    <ul className="flex justify-start items-center overflow-x-auto flex-nowrap passport-scrollbar pb-1 -mb-1 px-2 space-x-2">
                        {navItems.map((item, index) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => changePage(index)}
                                    className={`relative flex flex-col items-center justify-center w-14 h-14 min-w-[3.5rem] rounded-full text-xs font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue ${pageIndex === index ? 'text-brand-blue dark:text-brand-light-blue' : 'text-gray-500 hover:text-brand-blue dark:hover:text-brand-light-blue'}`}
                                    aria-label={item.label}
                                >
                                    <item.icon className="w-6 h-6 mb-1" />
                                    <span>{item.label}</span>
                                    {pageIndex === index && (
                                        <motion.div
                                            className="absolute inset-0 bg-brand-blue/10 dark:bg-brand-light-blue/20 rounded-full"
                                            layoutId="active-passport-tab"
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ActivityVisaPage;
