import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Event } from '../../data/events.ts';
import { FiClock, FiMapPin } from 'react-icons/fi';

type Filter = 'all' | 'day1' | 'day2' | 'mine';

const SchedulePage: React.FC = () => {
    const { events: allEvents, user } = useAuth();
    const [filter, setFilter] = useState<Filter>('all');
    
    const userRegisteredEventIds = useMemo(() => {
        if (!user) return new Set();
        return new Set(user.events.filter(e => e.registered).map(e => e.id));
    }, [user]);

    const filteredEvents = useMemo(() => {
        let sorted = [...allEvents].sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;

            const timeA = a.time.toUpperCase();
            const timeB = b.time.toUpperCase();
            if (timeA === "ALL DAY") return -1;
            if (timeB === "ALL DAY") return 1;

            const getMinutes = (time: string) => {
                const parts = time.match(/(\d+):(\d+)\s*(AM|PM)/);
                if (!parts) return 0;
                let hours = parseInt(parts[1], 10);
                const minutes = parseInt(parts[2], 10);
                const period = parts[3];

                if (period === 'PM' && hours !== 12) {
                    hours += 12;
                }
                if (period === 'AM' && hours === 12) {
                    hours = 0;
                }
                return hours * 60 + minutes;
            };

            return getMinutes(timeA) - getMinutes(timeB);
        });

        if (filter === 'day1') {
            return sorted.filter(e => e.date === 'Sat, Nov 23');
        }
        if (filter === 'day2') {
            return sorted.filter(e => e.date === 'Sun, Nov 24');
        }
        if (filter === 'mine') {
            return sorted.filter(e => userRegisteredEventIds.has(e.id));
        }
        return sorted;
    }, [allEvents, filter, userRegisteredEventIds]);

    const FilterButton: React.FC<{ value: Filter; label: string }> = ({ value, label }) => (
        <button
            onClick={() => setFilter(value)}
            className={`relative w-full py-2 px-4 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-passport-primary ${filter === value ? 'text-brand-passport-primary' : 'text-brand-passport-subtle hover:text-brand-passport-primary'}`}
        >
            {label}
             {filter === value && (
                <motion.div
                    layoutId="schedule-filter-highlight"
                    className="absolute inset-0 bg-brand-passport-accent/30 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
        </button>
    );

    return (
        <motion.div
            className="w-full h-full bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-inner flex flex-col min-h-[400px]"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.h3 variants={itemSpringUp} className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100 mb-4 border-b-2 border-brand-passport-subtle dark:border-gray-700 pb-2">Event Schedule</motion.h3>
            <motion.div variants={itemSpringUp} className="grid grid-cols-4 justify-around bg-gray-100 dark:bg-gray-700/50 rounded-full p-1 mb-4 z-10">
                <FilterButton value="all" label="All" />
                <FilterButton value="day1" label="Day 1" />
                <FilterButton value="day2" label="Day 2" />
                <FilterButton value="mine" label="My Schedule" />
            </motion.div>
            <motion.div 
                className="overflow-y-auto flex-grow pr-2 -mr-2 space-y-3"
                variants={staggerContainer(0.05)}
            >
                {filteredEvents.map(event => (
                    <motion.div key={event.id} variants={itemSpringUp} className="bg-brand-bg/60 dark:bg-gray-700/30 p-3 rounded-lg">
                        <p className="font-bold text-brand-passport-primary dark:text-gray-200">{event.name}</p>
                        <div className="flex items-center justify-between mt-1 text-xs text-brand-passport-primary/80 dark:text-gray-400">
                            <span className="flex items-center gap-1.5"><FiClock size={12}/> {event.date}, {event.time}</span>
                            <span className="flex items-center gap-1.5"><FiMapPin size={12}/> {event.location}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default SchedulePage;