import * as React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiCheckSquare, FiGift } from 'react-icons/fi';
import { useAuth, DashboardStats } from '../../contexts/AuthContext.tsx';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import AnimatedCounter from '../AnimatedCounter.tsx';
import SkeletonLoader from '../SkeletonLoader.tsx';

const StatCard = ({ icon, title, value, color, iconColor }: { icon: React.ReactNode, title: string, value: number, color: string, iconColor: string }) => (
    <motion.div 
        variants={itemSpringUp}
        className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md flex items-center transition-transform transform hover:-translate-y-1"
    >
        <div className={`p-3 md:p-4 rounded-full ${color}`}>
            <div className={iconColor}>{icon}</div>
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <AnimatedCounter to={value} className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100" />
        </div>
    </motion.div>
);

const SkeletonStatCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md flex items-center">
        <SkeletonLoader className="h-12 w-12 md:h-16 md:w-16 rounded-full" />
        <div className="ml-4 flex-grow">
            <SkeletonLoader className="h-4 w-2/3 rounded-md mb-2" />
            <SkeletonLoader className="h-8 w-1/2 rounded-md" />
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { getDashboardStats } = useAuth();
    const [stats, setStats] = React.useState<DashboardStats | null>(null);

    React.useEffect(() => {
        // Simulate fetch
        const timer = setTimeout(() => setStats(getDashboardStats()), 500);
        return () => clearTimeout(timer);
    }, [getDashboardStats]);

    return (
        <motion.div 
            className="p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Dashboard Overview</h1>
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"
                variants={staggerContainer(0.1)}
                initial="hidden"
                animate="visible"
            >
                {!stats ? (
                    <>
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                    </>
                ) : (
                    <>
                        <StatCard 
                            icon={<FiUsers className="h-6 w-6 md:h-8 md:w-8" />} 
                            title="Total Students" 
                            value={stats.totalUsers} 
                            color="bg-blue-100 dark:bg-blue-900/30"
                            iconColor="text-blue-600 dark:text-blue-300"
                        />
                        <StatCard 
                            icon={<FiCalendar className="h-6 w-6 md:h-8 md:w-8" />} 
                            title="Total Events" 
                            value={stats.totalEvents} 
                            color="bg-green-100 dark:bg-green-900/30" 
                            iconColor="text-green-600 dark:text-green-300"
                        />
                        <StatCard 
                            icon={<FiCheckSquare className="h-6 w-6 md:h-8 md:w-8" />} 
                            title="Events Completed" 
                            value={stats.totalCompletedEvents} 
                            color="bg-teal-100 dark:bg-teal-900/30"
                            iconColor="text-teal-600 dark:text-teal-300"
                        />
                        <StatCard 
                            icon={<FiGift className="h-6 w-6 md:h-8 md:w-8" />} 
                            title="Total Points Awarded" 
                            value={stats.totalPointsAwarded}
                            color="bg-yellow-100 dark:bg-yellow-900/30"
                            iconColor="text-yellow-600 dark:text-yellow-300"
                        />
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboardPage;