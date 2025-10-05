import * as React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Event } from '../../data/events.ts';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import { FiCalendar, FiMapPin, FiGift, FiUsers } from 'react-icons/fi';
import SkeletonLoader from '../SkeletonLoader.tsx';

const EventRow: React.FC<{ event: Event }> = ({ event }) => {
    return (
        <motion.tr variants={itemSpringUp} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="py-3 px-4 text-sm font-semibold text-gray-800 dark:text-gray-200">{event.name}</td>
            <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                <div className="flex items-center gap-2">
                    <FiCalendar size={14} />
                    <span>{event.date} at {event.time}</span>
                </div>
            </td>
            <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                <div className="flex items-center gap-2">
                    <FiMapPin size={14} />
                    <span>{event.location}</span>
                </div>
            </td>
            <td className="py-3 px-4 text-sm font-bold text-brand-teal dark:text-teal-400 hidden sm:table-cell">
                <div className="flex items-center gap-2">
                    <FiGift size={14} />
                    <span>{event.points}</span>
                </div>
            </td>
            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                 <div className="flex items-center gap-2">
                    <FiUsers size={14} />
                    <span>{event.participants}</span>
                </div>
            </td>
        </motion.tr>
    );
};

const SkeletonEventRow: React.FC = () => (
    <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="py-3 px-4"><SkeletonLoader className="h-5 w-3/4 rounded-md" /></td>
        <td className="py-3 px-4 hidden md:table-cell"><SkeletonLoader className="h-5 w-full rounded-md" /></td>
        <td className="py-3 px-4 hidden lg:table-cell"><SkeletonLoader className="h-5 w-full rounded-md" /></td>
        <td className="py-3 px-4 hidden sm:table-cell"><SkeletonLoader className="h-5 w-1/2 rounded-md" /></td>
        <td className="py-3 px-4 hidden sm:table-cell"><SkeletonLoader className="h-5 w-1/2 rounded-md" /></td>
    </tr>
);

const AdminEventManagementPage: React.FC = () => {
    const { getMasterEvents } = useAuth();
    const [events, setEvents] = React.useState<Event[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setEvents(getMasterEvents());
            setIsLoading(false);
        }, 500); // Simulate fetch
        return () => clearTimeout(timer);
    }, [getMasterEvents]);

    return (
        <motion.div
            className="p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Event Management</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Event Name</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 hidden md:table-cell">Schedule</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 hidden lg:table-cell">Location</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 hidden sm:table-cell">Points</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 hidden sm:table-cell">Capacity</th>
                            </tr>
                        </thead>
                        <motion.tbody variants={staggerContainer(0.05)}>
                            {isLoading ? (
                                Array.from({ length: 10 }).map((_, i) => <SkeletonEventRow key={i} />)
                            ) : (
                                events.map(event => (
                                    <EventRow key={event.id} event={event} />
                                ))
                            )}
                        </motion.tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminEventManagementPage;