import * as React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import { FiUser, FiAward, FiBookmark, FiPhone, FiShare2 } from 'react-icons/fi';
import { FaGraduationCap, FaStream } from 'react-icons/fa';
import { achievementsList } from '../../data/achievements.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import Modal from '../Modal.tsx';
import ShareableSummary from '../ShareableSummary.tsx';
import SkeletonLoader from '../SkeletonLoader.tsx';

const ProfilePageSkeleton: React.FC = () => (
    <motion.div 
        className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <div className="flex justify-between items-center mb-4 border-b-2 border-brand-passport-subtle/30 dark:border-gray-700/50 pb-2">
            <SkeletonLoader className="h-8 w-1/3 rounded-md" />
            <SkeletonLoader className="h-8 w-20 rounded-full" />
        </div>
        
        <div className="flex gap-4 items-start mb-4">
            <SkeletonLoader className="w-24 h-32 rounded-sm" />
            <div className="flex-grow space-y-3">
                <SkeletonLoader className="h-10 w-full rounded-md" />
                <SkeletonLoader className="h-10 w-full rounded-md" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 mb-4">
            <SkeletonLoader className="h-10 w-full rounded-md" />
            <SkeletonLoader className="h-10 w-full rounded-md" />
        </div>
        
        <div className="grid grid-cols-2 gap-x-4">
            <SkeletonLoader className="h-10 w-full rounded-md" />
            <SkeletonLoader className="h-10 w-full rounded-md" />
        </div>
        
        <div className="flex-grow" />

        <div className="text-center space-y-1 mt-4">
            <SkeletonLoader className="h-3 w-1/2 mx-auto rounded-sm" />
            <SkeletonLoader className="h-3 w-3/4 mx-auto rounded-sm" />
            <SkeletonLoader className="h-3 w-3/4 mx-auto rounded-sm" />
        </div>
    </motion.div>
);

const DataRow: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="border-b border-brand-passport-subtle/30 dark:border-gray-600/50 py-2">
        <div className="flex items-center gap-2 text-xs text-brand-passport-subtle dark:text-gray-400 font-semibold">
            {icon}
            <span>{label}</span>
        </div>
        <p className="text-lg font-mono text-brand-passport-primary dark:text-gray-200 tracking-wider">{value}</p>
    </div>
);


const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500); // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <ProfilePageSkeleton />;
    }

    if (!user) {
        return null;
    }
    
    const unlockedAchievements = achievementsList.filter(ach => user.achievements.includes(ach.id));
    
    const passportName = user.fullName.toUpperCase().replace(/\s/g, '<').padEnd(30, '<');
    const passportId = `ID${user.contact}`.padEnd(30, '<');


    return (
        <>
        <motion.div 
            className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.div variants={itemSpringUp} className="flex justify-between items-center mb-4 border-b-2 border-brand-passport-subtle dark:border-gray-700 pb-2">
                <h3 className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100">Personal Information</h3>
                <motion.button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-teal text-white text-xs font-bold py-1.5 px-3 rounded-full hover:bg-teal-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiShare2 />
                    Share
                </motion.button>
            </motion.div>
            
            <motion.div variants={itemSpringUp} className="flex gap-4 items-start mb-4">
                 <div className="w-24 h-32 bg-gray-200 dark:bg-gray-700 border-2 border-brand-passport-subtle dark:border-gray-600 flex items-center justify-center overflow-hidden">
                    <img src={user.photo || `https://i.pravatar.cc/150?u=${user.contact}`} alt="Student" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                    <DataRow label="Full Name" value={user.fullName} icon={<FiUser />} />
                    <DataRow label="Contact No." value={user.contact} icon={<FiPhone />} />
                </div>
            </motion.div>

            <motion.div variants={itemSpringUp} className="grid grid-cols-2 gap-x-4 mb-4">
                <DataRow label="Class" value={user.class} icon={<FaGraduationCap />} />
                <DataRow label="Stream" value={user.stream} icon={<FaStream />} />
            </motion.div>
            
             <motion.div variants={itemSpringUp} className="grid grid-cols-2 gap-x-4">
                <DataRow label="VISA Points" value={String(user.visaPoints)} icon={<FiAward />} />
                <DataRow label="Achievements" value={`${unlockedAchievements.length}/${achievementsList.length}`} icon={<FiBookmark />} />
            </motion.div>

            <div className="flex-grow" /> 
            
            <motion.div variants={itemSpringUp} className="text-center text-xs text-brand-passport-subtle/80 dark:text-gray-500 font-mono mt-4">
                <p>REPUBLIC OF YOUTHOPIA</p>
                <p>P&lt;YTH&lt;{passportName}</p>
                <p>{passportId}</p>
            </motion.div>
        </motion.div>
        <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
            <ShareableSummary user={user} />
            <div className="mt-4 p-2 bg-blue-50 dark:bg-gray-700 rounded-md text-center">
                <p className="text-sm text-brand-blue dark:text-gray-300 font-semibold">Right-click or long-press the image to save and share your journey!</p>
            </div>
        </Modal>
        </>
    );
};

export default ProfilePage;