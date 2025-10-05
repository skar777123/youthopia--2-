import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from 'framer-motion';
import { FiArrowRight, FiChevronsRight } from 'react-icons/fi';
import { FaBrain, FaUsers, FaHandsHelping, FaQuoteLeft } from 'react-icons/fa';
import { sectionEase, staggerContainer, itemSpringUp } from '../utils/animations.ts';
import { testimonials } from '../data/testimonials.ts';
import { affirmations } from '../data/affirmations.ts';
import DomeGallery from './DomeGallery.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { eventsData, type Event } from '../data/events.ts';
import { getEventPhase, type EventPhase } from '../utils/eventCategorization.ts';

const WavyDivider: React.FC<{ fromColor: string; toColor: string; className?: string }> = ({ fromColor, toColor, className }) => (
    <div className={`relative -mb-1 ${className}`} aria-hidden="true" style={{ backgroundColor: fromColor }}>
        <svg className="w-full h-auto" width="1440" height="120" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
                d="M0 120 C240 120 480 120 720 120 C960 120 1200 120 1440 120 V120 H0 V120 Z"
                fill={toColor}
                initial={{ d: "M0 120 C240 120 480 120 720 120 C960 120 1200 120 1440 120 V120 H0 V120 Z" }}
                whileInView={{ d: "M0,64 C240,110 480,20 720,50 C960,80 1200,10 1440,80 V120 H0 Z" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
        </svg>
    </div>
);

const FloatingShapes: React.FC = () => (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
                key={i}
                className="absolute bg-brand-blue/10 dark:bg-brand-light-blue/10 rounded-full"
                initial={{
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    scale: 0,
                    opacity: 0,
                }}
                animate={{
                    x: `calc(${Math.random() * 100}vw - 50%)`,
                    y: `calc(${Math.random() * 100}vh - 50%)`,
                    scale: Math.random() * 0.5 + 0.3,
                    opacity: [0, 1, 0],
                }}
                transition={{
                    duration: Math.random() * 15 + 10,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: Math.random() * 5,
                }}
                style={{
                    width: `${Math.random() * 100 + 50}px`,
                    height: `${Math.random() * 100 + 50}px`,
                }}
            />
        ))}
    </div>
);

const phasesData = [
  {
    icon: <FaBrain className="h-10 w-10 text-amber-500" />,
    title: "Phase 01 – Awareness",
    phaseName: "Awareness" as EventPhase,
    description: "These activities aim to build self-awareness and emotional insight.",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800/50",
    hoverBorderColor: "hover:border-amber-400 dark:hover:border-amber-600",
  },
  {
    icon: <FaUsers className="h-10 w-10 text-blue-500" />,
    title: "Phase 02 – Engagement",
    phaseName: "Engagement" as EventPhase,
    description: "These tools and events encourage active participation and emotional expression.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800/50",
    hoverBorderColor: "hover:border-blue-400 dark:hover:border-blue-600",
  },
  {
    icon: <FaHandsHelping className="h-10 w-10 text-teal-500" />,
    title: "Phase 03 – Seeking Help",
    phaseName: "Seeking Help" as EventPhase,
    description: "These activities focus on reflection, therapy, and professional support.",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-800/50",
    hoverBorderColor: "hover:border-teal-400 dark:hover:border-teal-600",
  }
];

const PhaseSection: React.FC<{ phase: typeof phasesData[0]; events: Event[]; motionProps?: any }> = ({ phase, events, motionProps = {} }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleEventClick = (event: Event) => {
        if (user) {
            // If user is logged in, go to dashboard and highlight the event
            navigate('/dashboard', { state: { highlightEventId: event.id } });
        } else {
            // If user is not logged in, go to auth page with a message
            navigate('/auth', { 
                state: { 
                    fromEventId: event.id,
                    message: "Registration Required. Please register or log in to view this event's VISA status."
                } 
            });
        }
    };
    
    return (
    <motion.div
        className={`rounded-2xl shadow-lg border ${phase.borderColor} ${phase.hoverBorderColor} ${phase.bgColor} p-6 md:p-8 transition-all duration-300 flex flex-col`}
        variants={itemSpringUp}
        whileHover={{ y: -8, scale: 1.02, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)" }}
        {...motionProps}
    >
        <div className="flex items-center gap-4 mb-4">
            {phase.icon}
            <div>
                <h3 className="text-xl md:text-2xl font-bold text-brand-dark-blue dark:text-gray-100">{phase.title}</h3>
                <p className="text-sm md:text-base text-brand-blue dark:text-gray-400">{phase.description}</p>
            </div>
        </div>
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-grow"
            variants={staggerContainer(0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {events.map(event => (
                <motion.div 
                    key={event.id}
                    variants={itemSpringUp} 
                    className="p-3 bg-white/60 dark:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md hover:bg-white dark:hover:bg-white/20"
                    onClick={() => handleEventClick(event)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleEventClick(event)}
                >
                    <h4 className="font-semibold text-brand-dark-blue dark:text-gray-200">{event.name}</h4>
                    <p className="text-sm text-brand-blue dark:text-gray-400">{event.description.split('.')[0]}.</p>
                </motion.div>
            ))}
        </motion.div>
    </motion.div>
    )
};

const staggeredTextContainer: Variants = {
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const staggeredLetter: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
};

const AnimatedHeading: React.FC<{ text: string, className: string }> = ({ text, className }) => (
    <motion.h1
        className={`${className}`}
        variants={staggeredTextContainer}
        initial="hidden"
        animate="visible"
        aria-label={text}
    >
        {text.split("").map((char, index) => (
            <motion.span key={index} variants={staggeredLetter} className="inline-block">
                {char === " " ? "\u00A0" : char}
            </motion.span>
        ))}
    </motion.h1>
);


const HomePage: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const affirmationIndex = React.useMemo(() => {
        // This ensures the affirmation changes once per day
        return new Date().getDate() % affirmations.length;
    }, []);


    const eventsByPhase = React.useMemo(() => {
        const grouped: Record<EventPhase, Event[]> = { 'Awareness': [], 'Engagement': [], 'Seeking Help': [] };
        for (const event of eventsData) {
            const phase = getEventPhase(event.id);
            grouped[phase].push(event);
        }
        return grouped;
    }, []);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.5 } },
                exit: { opacity: 0 }
            }}
            className="overflow-hidden bg-brand-bg dark:bg-brand-black"
        >
            {/* Hero Section */}
            <section className="relative container mx-auto text-center px-4 min-h-[80vh] flex flex-col justify-center pt-20 pb-10 overflow-hidden">
                <FloatingShapes />
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: sectionEase, delay: 0.2 }}
                    className="relative z-10"
                >
                     <AnimatedHeading 
                        text="Your Journey to" 
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-dark-blue dark:text-gray-100 tracking-tight"
                    />
                    <AnimatedHeading 
                        text="Mental Wellness Begins Here" 
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-blue dark:text-brand-light-blue tracking-tight mt-2"
                    />
                </motion.div>

                <motion.p
                    className="mt-4 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-brand-blue dark:text-gray-300 relative z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: sectionEase, delay: 0.4 }}
                >
                    Explore a framework designed to guide you from self-awareness to active engagement and seeking support.
                </motion.p>
                <motion.div
                    className="mt-8 flex justify-center relative z-10"
                     initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: sectionEase, delay: 0.6 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        animate={{
                            scale: [1, 1.03, 1],
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }
                        }}
                    >
                        <NavLink to="/auth" className="inline-block bg-brand-yellow text-brand-dark-blue font-bold py-3 px-8 rounded-full text-base sm:text-lg hover:bg-yellow-300 transition-colors duration-200 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500">
                            Join the Community
                        </NavLink>
                    </motion.div>
                </motion.div>
            </section>
            
            <div className="dark:hidden"><WavyDivider fromColor={'#F0F7FF'} toColor={'#FFFFFF'} /></div>
            <div className="hidden dark:block"><WavyDivider fromColor={'#000000'} toColor={'#030712'} /></div>


            {/* Phases Framework Section */}
            <section className="bg-white dark:bg-gray-950 py-24 md:py-32">
                 <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7, ease: sectionEase }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue dark:text-gray-100 mb-4">A Three-Phase Framework</h2>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-brand-blue dark:text-gray-400">
                            Our activities are structured to support you at every stage of your mental wellness journey. Click an event to learn more.
                        </p>
                    </motion.div>
                     
                     {/* Desktop: 3-Column Grid */}
                     <motion.div 
                        className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                        variants={staggerContainer(0.2)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                     >
                        {phasesData.map((phase) => (
                            <PhaseSection key={phase.title} phase={phase} events={eventsByPhase[phase.phaseName]} />
                        ))}
                     </motion.div>

                     {/* Mobile: Tabs */}
                     <div className="lg:hidden max-w-xl mx-auto">
                        <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-6">
                            {phasesData.map((phase, index) => (
                                <button
                                    key={phase.title}
                                    onClick={() => setActiveTab(index)}
                                    className={`relative py-3 px-4 font-semibold text-sm transition-colors ${activeTab === index ? 'text-brand-blue dark:text-brand-light-blue' : 'text-gray-500 hover:text-brand-blue'}`}
                                >
                                    {phase.title.split('–')[1].trim()}
                                    {activeTab === index && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue dark:bg-brand-light-blue"
                                            layoutId="active-tab-underline"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        <AnimatePresence mode="wait">
                            <PhaseSection 
                                key={activeTab} 
                                phase={phasesData[activeTab]}
                                events={eventsByPhase[phasesData[activeTab].phaseName]}
                                motionProps={{
                                    initial: { opacity: 0, y: 20 },
                                    animate: { opacity: 1, y: 0 },
                                    exit: { opacity: 0, y: -20 },
                                    transition: { duration: 0.3 }
                                }}
                            />
                        </AnimatePresence>
                     </div>
                </div>
            </section>

            <div className="dark:hidden"><WavyDivider fromColor={'#FFFFFF'} toColor={'#F0F7FF'} className="-scale-y-100" /></div>
            <div className="hidden dark:block"><WavyDivider fromColor={'#030712'} toColor={'#000000'} className="-scale-y-100" /></div>

            {/* Daily Affirmation Section */}
            <section className="bg-brand-bg dark:bg-brand-black py-24 md:py-32 relative overflow-hidden">
                <FaQuoteLeft className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] text-brand-blue/5 dark:text-brand-light-blue/5 transform-gpu" aria-hidden="true" />
                <motion.div
                    className="container mx-auto px-4 text-center relative"
                    variants={staggerContainer()}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <motion.h2 variants={itemSpringUp} className="text-3xl md:text-4xl font-bold text-brand-dark-blue dark:text-gray-100 mb-4">A Moment for You</motion.h2>
                    <motion.blockquote variants={itemSpringUp} className="max-w-3xl mx-auto min-h-[6rem] md:min-h-[7rem] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={affirmationIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                className="text-2xl md:text-3xl font-serif italic text-brand-blue dark:text-gray-300"
                            >
                                "{affirmations[affirmationIndex]}"
                            </motion.p>
                        </AnimatePresence>
                    </motion.blockquote>
                </motion.div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-brand-bg dark:bg-brand-black py-24 md:py-32">
                <motion.div
                    className="container mx-auto px-4 text-center"
                    variants={staggerContainer()}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h2 variants={itemSpringUp} className="text-3xl md:text-4xl font-bold text-brand-dark-blue dark:text-gray-100 mb-4">What Our Community Says</motion.h2>
                    <motion.div variants={itemSpringUp} className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg relative">
                        <FaQuoteLeft className="absolute top-4 left-4 text-4xl md:text-5xl text-brand-yellow/20" />
                        <p className="text-lg md:text-xl italic text-brand-blue dark:text-gray-300">"{testimonials[0].quote}"</p>
                        <div className="mt-6 flex items-center justify-center">
                            <img src={testimonials[0].avatar} alt={testimonials[0].name} className="w-12 h-12 rounded-full mr-4 border-2 border-brand-yellow" />
                            <div>
                                <p className="font-bold text-brand-dark-blue dark:text-gray-100">{testimonials[0].name}</p>
                                <p className="text-sm text-brand-blue/80 dark:text-gray-400">{testimonials[0].role}</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemSpringUp} className="mt-8">
                        <NavLink to="/testimonials" className="inline-flex items-center gap-2 font-bold text-brand-blue dark:text-brand-light-blue group">
                           View More Stories
                           <motion.div variants={{ hover: { x: 5 } }} transition={{ type: 'spring', stiffness: 400, damping: 10 }} className="group-hover:translate-x-1 transition-transform">
                             <FiChevronsRight />
                           </motion.div>
                        </NavLink>
                    </motion.div>
                </motion.div>
            </section>

            <div className="dark:hidden"><WavyDivider fromColor={'#F0F7FF'} toColor={'#FFFFFF'} /></div>
            <div className="hidden dark:block"><WavyDivider fromColor={'#000000'} toColor={'#030712'} /></div>
            
            {/* Gallery Section */}
            <section className="bg-white dark:bg-gray-950 py-24 md:py-32">
                 <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7, ease: sectionEase }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue dark:text-gray-100 mb-4">Community Moments</h2>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-brand-blue dark:text-gray-400">
                            Glimpses of connection, creativity, and shared experiences from our events.
                        </p>
                    </motion.div>
                    <DomeGallery />
                </div>
            </section>
        </motion.div>
    );
};

export default HomePage;