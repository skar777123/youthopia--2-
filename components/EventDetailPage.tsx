

import * as React from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Event } from '../data/events.ts';
import { pageTransition, itemSpringUp, staggerContainer } from '../utils/animations.ts';
import { FiCalendar, FiClock, FiMapPin, FiGift, FiUsers, FiCheckCircle, FiEdit, FiCamera, FiAward } from 'react-icons/fi';
import { FaMedal } from 'react-icons/fa';
import { getEventPhase, phaseDetails } from '../utils/eventCategorization.ts';

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 text-brand-blue dark:text-gray-300">
        <div className="text-brand-teal text-xl">{icon}</div>
        <div>
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-base font-bold text-brand-dark-blue dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const PrizeItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 text-brand-blue dark:text-gray-300">
        <div className="text-yellow-500 text-xl">{icon}</div>
        <div>
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-base font-bold text-brand-dark-blue dark:text-gray-100">{value}</p>
        </div>
    </div>
);


const EventDetailPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { events, user, registerForEvent } = useAuth();
    const [event, setEvent] = React.useState<Event | null>(null);
    const [showConfirmation, setShowConfirmation] = React.useState(false);

    React.useEffect(() => {
        const currentEvent = events.find(e => e.id === eventId);
        if (currentEvent) {
            setEvent(currentEvent);
        } else {
            navigate('/dashboard', { replace: true });
        }
    }, [eventId, events, navigate]);

    const handleRegister = () => {
        if (event) {
            registerForEvent(event.id);
            setShowConfirmation(true);
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 2500); // Wait for animation to finish
        }
    };
    
    if (showConfirmation) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center"
                >
                    <motion.svg className="w-24 h-24 mx-auto text-green-500" viewBox="0 0 24 24"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <motion.path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 4L12 14.01l-3-3"
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           transition={{ duration: 0.4, ease: "easeInOut", delay: 0.5 }}
                        ></motion.path>
                    </motion.svg>
                    <h2 className="text-2xl font-bold mt-4 text-brand-dark-blue dark:text-gray-100">Registration Successful!</h2>
                     <p className="mt-2 text-lg text-brand-blue dark:text-gray-300">
                        You are now registered for <strong>{event?.name}</strong>!
                    </p>
                </motion.div>
            </motion.div>
        )
    }

    if (!event || !user) {
        return (
            <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
                <p>Loading event...</p>
            </div>
        );
    }

    const eventPhase = getEventPhase(event.id);
    const { name: phaseName, icon: phaseIcon, color: phaseColor } = phaseDetails[eventPhase];

    return (
        <motion.div
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="container mx-auto px-4 py-8 md:py-12"
        >
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
                <motion.div variants={staggerContainer()} initial="hidden" animate="visible">
                    <motion.div variants={itemSpringUp} className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                        <div className={`flex items-center gap-2 text-sm font-bold ${phaseColor}`}>
                            {phaseIcon}
                            <span>{phaseName} Phase</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark-blue dark:text-gray-100 mt-2">{event.name}</h1>
                    </motion.div>

                    <motion.p variants={itemSpringUp} className="text-base md:text-md text-brand-blue dark:text-gray-300 mb-6">{event.description}</motion.p>

                    <motion.div variants={staggerContainer(0.1)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                        <motion.div variants={itemSpringUp}><DetailItem icon={<FiCalendar />} label="Date" value={event.date} /></motion.div>
                        <motion.div variants={itemSpringUp}><DetailItem icon={<FiClock />} label="Time" value={event.time} /></motion.div>
                        <motion.div variants={itemSpringUp}><DetailItem icon={<FiMapPin />} label="Location" value={event.location} /></motion.div>
                        <motion.div variants={itemSpringUp}><DetailItem icon={<FiUsers />} label="Participants" value={event.participants} /></motion.div>
                        <motion.div variants={itemSpringUp}><DetailItem icon={<FiGift />} label="Points" value={`${event.points} pts`} /></motion.div>
                    </motion.div>

                    <motion.div variants={itemSpringUp} className="mb-8">
                        <h3 className="font-bold text-lg text-brand-dark-blue dark:text-gray-100 mb-2">Prizes</h3>
                         <motion.div variants={staggerContainer(0.1)} className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                            <motion.div variants={itemSpringUp}><PrizeItem icon={<FiAward />} label="1st Prize" value={'₹' + event.prizes.first} /></motion.div>
                            <motion.div variants={itemSpringUp}><PrizeItem icon={<FaMedal />} label="2nd Prize" value={'₹' + event.prizes.second} /></motion.div>
                            <motion.div variants={itemSpringUp}><PrizeItem icon={<FaMedal className="opacity-70"/>} label="3rd Prize" value={'₹' + event.prizes.third} /></motion.div>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={itemSpringUp} className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {event.completed ? (
                            <div className="text-center w-full">
                                <div className="inline-flex items-center gap-2 text-lg font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 py-3 px-6 rounded-full">
                                    <FiCheckCircle />
                                    <span>Event Completed!</span>
                                </div>
                                {!event.feedback && (
                                    <NavLink to={`/feedback/${event.id}`} className="mt-4 block font-semibold text-brand-blue dark:text-brand-light-blue hover:underline">
                                        <FiEdit className="inline mr-1" />
                                        Share your feedback
                                    </NavLink>
                                )}
                            </div>
                        ) : event.registered ? (
                            <div className="text-center w-full">
                                <div className="inline-flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 py-3 px-6 rounded-full">
                                    <FiCheckCircle />
                                    <span>You are Registered</span>
                                </div>
                                <NavLink to={`/qr-scanner/${event.id}`} className="mt-4 block font-semibold text-brand-blue dark:text-brand-light-blue hover:underline">
                                    <FiCamera className="inline mr-1" />
                                     Ready to complete? Scan the event QR code.
                                </NavLink>
                            </div>
                        ) : (
                            <motion.button
                                onClick={handleRegister}
                                className="w-full sm:w-auto bg-brand-yellow text-brand-dark-blue font-bold py-3 px-10 rounded-full text-lg hover:bg-yellow-300 transition-colors duration-200 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Register Now
                            </motion.button>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EventDetailPage;
