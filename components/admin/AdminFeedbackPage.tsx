import * as React from 'react';
import { motion } from 'framer-motion';
import { useAuth, FeedbackEntry } from '../../contexts/AuthContext.tsx';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import SkeletonLoader from '../SkeletonLoader.tsx';

const SkeletonFeedbackCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <SkeletonLoader className="h-6 w-1/3 rounded-md mb-4" />
        <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                    <SkeletonLoader className="h-10 w-10 rounded-full" />
                    <div className="flex-grow">
                        <SkeletonLoader className="h-5 w-1/2 rounded-md mb-2" />
                        <SkeletonLoader className="h-4 w-1/3 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AdminFeedbackPage: React.FC = () => {
    const { getAllFeedback } = useAuth();
    const [feedbackData, setFeedbackData] = React.useState<FeedbackEntry[] | null>(null);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setFeedbackData(getAllFeedback());
        }, 500); // Simulate fetch
        return () => clearTimeout(timer);
    }, [getAllFeedback]);

    const groupedFeedback = React.useMemo(() => {
        if (!feedbackData) return null;
        return feedbackData.reduce((acc, feedback) => {
            if (!acc[feedback.eventId]) {
                acc[feedback.eventId] = {
                    eventName: feedback.eventName,
                    feedbacks: [],
                };
            }
            acc[feedback.eventId].feedbacks.push(feedback);
            return acc;
        }, {} as Record<string, { eventName: string; feedbacks: FeedbackEntry[] }>);
    }, [feedbackData]);

    return (
        <motion.div 
            className="p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Feedback Hub</h1>
            {!groupedFeedback ? (
                 <div className="space-y-6">
                    <SkeletonFeedbackCard />
                    <SkeletonFeedbackCard />
                 </div>
            ) : Object.keys(groupedFeedback).length === 0 ? (
                <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                    <p className="text-gray-500">No feedback has been submitted yet.</p>
                </div>
            ) : (
                <motion.div 
                    className="space-y-6"
                    variants={staggerContainer(0.1)}
                    initial="hidden"
                    animate="visible"
                >
                    {Object.values(groupedFeedback).map(({ eventName, feedbacks }) => (
                        <motion.div 
                            key={eventName} 
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                            variants={itemSpringUp}
                        >
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">{eventName}</h2>
                            <div className="space-y-4">
                                {feedbacks.map((fb, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="text-4xl">{fb.feedback}</div>
                                        <div>
                                            <p className="font-semibold text-gray-700">{fb.userName}</p>
                                            <p className="text-sm text-gray-500">{fb.userContact}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default AdminFeedbackPage;