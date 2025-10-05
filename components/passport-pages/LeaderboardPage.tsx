import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiUser, FiList, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { FaCrown, FaShieldAlt } from 'react-icons/fa';
import { useAuth, LeaderboardEntry, TeamLeaderboardEntry } from '../../contexts/AuthContext.tsx';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import SkeletonLoader from '../SkeletonLoader.tsx';

const tooltipVariants = {
  rest: { opacity: 0, y: 5, scale: 0.9, transition: { duration: 0.2 }, pointerEvents: 'none' },
  hover: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 }, pointerEvents: 'auto' },
};

type LeaderboardMode = 'overall' | 'team';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className="relative w-full py-2 px-4 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-passport-primary">
        <span className={`relative z-10 ${isActive ? 'text-brand-passport-primary' : 'text-brand-passport-subtle hover:text-brand-passport-primary'}`}>
            {label}
        </span>
        {isActive && (
            <motion.div
                layoutId="leaderboard-mode-highlight"
                className="absolute inset-0 bg-brand-passport-accent/40 rounded-full"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
        )}
    </button>
);


const PodiumPlace: React.FC<{ entry: LeaderboardEntry; rank: number; heightClass: string; bgColorClass: string; isFirst?: boolean }> = ({ entry, rank, heightClass, bgColorClass, isFirst = false }) => (
    <motion.div
        className={`w-1/3 flex flex-col items-center justify-end p-2 rounded-t-lg text-center ${bgColorClass} shadow-lg ${entry.isCurrentUser ? 'border-2 border-brand-teal' : ''}`}
        style={{ height: heightClass }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ 
            y: 0, 
            opacity: 1,
            ...(entry.isCurrentUser && {
                 boxShadow: [
                    "0 0 0px 0px rgba(20, 184, 166, 0)",
                    "0 0 12px 4px rgba(20, 184, 166, 0.6)",
                    "0 0 0px 0px rgba(20, 184, 166, 0)"
                 ]
            })
        }}
        transition={{ 
            y: { type: 'spring', stiffness: 200, damping: 20, delay: 0.2 + (Math.abs(rank-2) * 0.1) },
            opacity: { type: 'spring', stiffness: 200, damping: 20, delay: 0.2 + (Math.abs(rank-2) * 0.1) },
            ...(entry.isCurrentUser && {
                 boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            })
        }}
    >
        {isFirst && <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        >
            <FaCrown className="text-2xl text-amber-300 mb-1" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'}} />
        </motion.div>}
        <p className="font-bold text-white text-lg md:text-xl">#{rank}</p>
        <p className="font-semibold text-white text-xs w-full truncate px-1">{entry.name}</p>
    </motion.div>
);

const SkeletonPodium: React.FC = () => (
    <div className="flex justify-center items-end gap-1 h-28 md:h-36">
        <SkeletonLoader className="w-1/3 rounded-t-lg" style={{ height: '85%' }} />
        <SkeletonLoader className="w-1/3 rounded-t-lg" style={{ height: '100%' }} />
        <SkeletonLoader className="w-1/3 rounded-t-lg" style={{ height: '70%' }} />
    </div>
);

const UserRankRow: React.FC<{ entry: LeaderboardEntry }> = ({ entry: { rank, name, isCurrentUser } }) => (
    <motion.div
        variants={itemSpringUp}
        className={`flex items-center p-2 rounded-md transition-shadow duration-300 ${isCurrentUser ? 'bg-brand-teal/20 dark:bg-brand-teal/30 text-brand-teal-800 dark:text-teal-300 font-bold border-2 border-brand-teal/50' : 'bg-white dark:bg-gray-700/50 hover:shadow-md'}`}
        whileHover={!isCurrentUser ? { y: -2, scale: 1.03 } : {}}
        animate={isCurrentUser ? {
            boxShadow: [
                "0 0 0px 0px rgba(20, 184, 166, 0)",
                "0 0 8px 2px rgba(20, 184, 166, 0.4)",
                "0 0 0px 0px rgba(20, 184, 166, 0)"
            ],
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        } : {}}
    >
        <span className="w-8 text-center font-semibold text-brand-passport-subtle dark:text-gray-400">#{rank}</span>
        <span className="flex-grow truncate dark:text-gray-200">{name}</span>
        {isCurrentUser && <FiUser className="ml-2 flex-shrink-0" />}
    </motion.div>
);

const TeamRankRow: React.FC<{ entry: TeamLeaderboardEntry }> = ({ entry: { rank, name, points, memberCount } }) => (
    <motion.div
        variants={itemSpringUp}
        className="flex items-center p-2 rounded-md bg-white dark:bg-gray-700/50 hover:shadow-md"
    >
        <span className="w-8 text-center font-semibold text-brand-passport-subtle dark:text-gray-400">#{rank}</span>
        <div className="flex items-center gap-2 flex-grow">
            <FaShieldAlt className="text-brand-blue dark:text-brand-light-blue" />
            <span className="truncate font-bold dark:text-gray-200">{name}</span>
        </div>
        <div className="flex items-center gap-4 text-right">
             <div className="text-xs">
                <span className="text-brand-passport-subtle dark:text-gray-400 block">{memberCount} Members</span>
            </div>
            <span className="font-bold text-brand-dark-blue dark:text-gray-100">{points.toLocaleString()} pts</span>
        </div>
    </motion.div>
);


const LeaderboardPage = () => {
    const { getTeamLeaderboard, getOverallLeaderboard } = useAuth();
    const [mode, setMode] = React.useState<LeaderboardMode>('overall');
    const [isLoading, setIsLoading] = React.useState(true);
    
    const [overallLeaderboard, setOverallLeaderboard] = React.useState<LeaderboardEntry[]>([]);
    const [teamLeaderboard, setTeamLeaderboard] = React.useState<TeamLeaderboardEntry[]>([]);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            if (mode === 'overall') {
                setOverallLeaderboard(getOverallLeaderboard());
            } else {
                setTeamLeaderboard(getTeamLeaderboard());
            }
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [mode, getOverallLeaderboard, getTeamLeaderboard]);
    

    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="flex flex-col h-full overflow-hidden">
                    {mode === 'overall' && <SkeletonPodium />}
                    <div className="space-y-2 mt-4">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonLoader key={i} className="h-10 w-full rounded-md" />)}
                    </div>
                 </div>
            )
        }
        
        if (mode === 'team') {
             return (
                <motion.div variants={staggerContainer(0.05)} className="overflow-y-auto flex-grow pr-1 -mr-1 space-y-1 pt-3">
                    {teamLeaderboard.map(entry => <TeamRankRow key={entry.rank} entry={entry} />)}
                </motion.div>
             )
        }
        
         const top3 = overallLeaderboard.slice(0, 3);
         const currentUserEntry = overallLeaderboard.find(e => e.isCurrentUser);
         const restOfTheList = overallLeaderboard.slice(3);
         const isUserInTop3 = currentUserEntry ? currentUserEntry.rank <= 3 : false;

        return (
            <>
            {overallLeaderboard.length > 0 ? (
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex justify-center items-end gap-1 h-28 md:h-36">
                        {top3.find(e => e.rank === 2) && <PodiumPlace entry={top3.find(e => e.rank === 2)!} rank={2} heightClass="85%" bgColorClass="bg-slate-400" />}
                        {top3.find(e => e.rank === 1) && <PodiumPlace entry={top3.find(e => e.rank === 1)!} rank={1} heightClass="100%" bgColorClass="bg-amber-500" isFirst />}
                        {top3.find(e => e.rank === 3) && <PodiumPlace entry={top3.find(e => e.rank === 3)!} rank={3} heightClass="70%" bgColorClass="bg-orange-400" />}
                    </div>
                    {currentUserEntry && !isUserInTop3 && (
                        <motion.div variants={itemSpringUp} className="my-3">
                            <h5 className="text-sm font-semibold text-brand-passport-primary/80 dark:text-gray-300 mb-1 pl-2">Your Rank</h5>
                            <UserRankRow entry={currentUserEntry} />
                        </motion.div>
                    )}
                    <motion.div variants={staggerContainer(0.05)} className="overflow-y-auto flex-grow pr-1 -mr-1 space-y-1 pt-3">
                            {restOfTheList.filter(e => !e.isCurrentUser).map(entry => (
                                <UserRankRow key={entry.rank} entry={entry} />
                            ))}
                    </motion.div>
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-brand-passport-subtle dark:text-gray-500">
                    <FiTrendingUp size={40} />
                    <p className="mt-2 font-semibold">No participants yet.</p>
                </div>
            )}
            </>
        )
    }

    return (
        <motion.div 
            className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col min-h-[400px]"
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.h3 variants={itemSpringUp} className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100 mb-4 border-b-2 border-brand-passport-subtle dark:border-gray-700 pb-2">Community Ranks</motion.h3>
            <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 md:p-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-full p-1 mb-2">
                    <TabButton label="Overall Ranks" isActive={mode === 'overall'} onClick={() => setMode('overall')} />
                    <TabButton label="Team Ranks" isActive={mode === 'team'} onClick={() => setMode('team')} />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        className="h-full flex flex-col overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default LeaderboardPage;