import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMedal, FaUsers } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Event } from '../../data/events.ts';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import Pagination from '../Pagination.tsx';
import SkeletonLoader from '../SkeletonLoader.tsx';
import { useTilt } from '../../hooks/useTilt.ts';

const ITEMS_PER_PAGE = 8;

const PrizeRow: React.FC<{ rank: number; amount: string; color: string }> = ({ rank, amount, color }) => (
    <div className="flex items-center gap-3">
        <FaMedal className={`text-2xl ${color}`} />
        <div className="flex-grow">
            <span className="text-sm font-semibold text-brand-passport-subtle dark:text-gray-400">{rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'} Prize</span>
            <p className="font-bold text-lg text-brand-passport-primary dark:text-gray-200">{'₹' + amount}</p>
        </div>
    </div>
);

const SkeletonPrizeCard: React.FC = () => (
    <div className="bg-white/80 dark:bg-gray-700/50 p-4 rounded-lg border border-brand-passport-subtle/20 dark:border-gray-600/50">
        <SkeletonLoader className="h-6 w-3/4 rounded-md mb-2" />
        <SkeletonLoader className="h-4 w-1/2 rounded-md mb-3" />
        <div className="space-y-2 pt-2 border-t border-brand-passport-subtle/20 dark:border-gray-600/50">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <SkeletonLoader className="w-6 h-6 rounded-full" />
                    <div className="flex-grow">
                        <SkeletonLoader className="h-4 w-1/3 rounded-md" />
                        <SkeletonLoader className="h-5 w-2/3 rounded-md mt-1" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const EventPrizeCard: React.FC<{ event: Event }> = ({ event }) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const { rotateX, rotateY } = useTilt(cardRef);

    return (
        <motion.div
            ref={cardRef}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            variants={itemSpringUp}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring' }}
            className="bg-white/80 dark:bg-gray-700/50 p-4 rounded-lg border border-brand-passport-subtle/20 dark:border-gray-600/50"
        >
            <div style={{ transform: "translateZ(20px)" }}>
                <h4 className="font-bold text-brand-passport-primary dark:text-gray-100 mb-2 truncate">{event.name}</h4>
                <div className="flex items-center gap-2 text-sm text-brand-passport-subtle dark:text-gray-400 mb-3">
                    <FaUsers />
                    <span>{event.participants} Participants</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-brand-passport-subtle/20 dark:border-gray-600/50">
                    <PrizeRow rank={1} amount={event.prizes.first} color="text-yellow-500" />
                    <PrizeRow rank={2} amount={event.prizes.second} color="text-slate-400" />
                    <PrizeRow rank={3} amount={event.prizes.third} color="text-orange-400" />
                </div>
            </div>
        </motion.div>
    );
};


const PrizesPage: React.FC = () => {
    const { events } = useAuth();
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);
    
    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500); // Simulate fetch
        return () => clearTimeout(timer);
    }, [currentPage]);

    const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
    const paginatedEvents = events.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <motion.div
            className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.h3 variants={itemSpringUp} className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100 mb-4 border-b-2 border-brand-passport-subtle dark:border-gray-700 pb-2">
                Event Prizes
            </motion.h3>
            <div className="overflow-y-auto flex-grow pr-2 -mr-2" style={{ perspective: "1000px" , minHeight: "400px"}}>
                <AnimatePresence mode="wait">
                     <motion.div
                        key={currentPage}
                        variants={staggerContainer(0.05)}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {isLoading ? (
                            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonPrizeCard key={i} />)
                        ) : (
                            paginatedEvents.map(event => (
                                <EventPrizeCard key={event.id} event={event} />
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            <motion.div variants={itemSpringUp} className="pt-4 mt-auto">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </motion.div>
        </motion.div>
    );
};

export default PrizesPage;