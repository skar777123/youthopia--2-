import * as React from 'react';
import { motion, type Variants } from 'framer-motion';

// A simple confetti particle component
const ConfettiParticle: React.FC<{ i: number }> = ({ i }) => {
    const colors = ['#E50081', '#00AEEF', '#FFC107', '#F26522', '#0033A1'];
    // Randomize properties for each particle
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const scale = Math.random() * 0.5 + 0.5;
    const duration = Math.random() * 0.5 + 0.8;
    const delay = 1.8; // Start after main animation

    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                backgroundColor: colors[i % colors.length],
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
            }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{
                opacity: [1, 1, 0],
                x: x,
                y: y,
                scale: scale,
            }}
            transition={{ duration, ease: "easeOut", delay }}
        />
    );
};


const SplashScreen: React.FC = () => {
    const youthopiaText = [
        { char: 'Y', color: '#E50081' },
        { char: 'O', color: '#D70E85' },
        { char: 'U', color: '#BC178D' },
        { char: 'T', color: '#7E2295' },
        { char: 'H', color: '#492596' },
        { char: 'O', color: '#0033A1' },
        { char: 'P', color: '#0033A1' },
        { char: 'I', color: '#0033A1' },
        { char: 'A', color: '#0033A1' },
    ];
    
    const presenterText = Array.from("B.K.Birla College");
    const presenterColors = ['#E50081', '#00AEEF', '#FFC107', '#F26522', '#0033A1', '#7E2295'];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };
    
    const presenterContainerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.2 },
        },
    };

    const presenterLetterVariants: Variants = {
        hidden: { opacity: 0, y: -20, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', damping: 12, stiffness: 200 },
        },
    };

    const mPowerVariants: Variants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.5 } },
    };

    const youthLetterVariants: Variants = {
        hidden: { opacity: 0, y: -50, scale: 0.5, rotateZ: -20 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateZ: 0,
            transition: { type: 'spring', damping: 10, stiffness: 150 },
        },
    };

    const opiaLetterVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } },
    };
    
    const iconVariants: Variants = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', damping: 10, stiffness: 100, delay: 1.5 },
        },
    };

    const taglineVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, delay: 1.8 } },
    };

    const swooshVariants: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: "easeInOut", delay: 0.2 } },
    };

    return (
        <div className="flex items-center justify-center h-screen w-full animated-gradient overflow-hidden">
            <motion.div
                className="relative flex flex-col items-center justify-center w-full max-w-2xl px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Confetti */}
                {Array.from({ length: 50 }).map((_, i) => (
                    <ConfettiParticle key={i} i={i} />
                ))}

                <motion.div
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark-blue/90 tracking-wide mb-4 text-center"
                    variants={presenterContainerVariants}
                >
                    {presenterText.map((char, index) => (
                        <motion.span
                            key={index}
                            variants={presenterLetterVariants}
                            style={{ color: presenterColors[index % presenterColors.length] }}
                            className="inline-block"
                        >
                            {char === " " ? " " : char}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Swoosh SVG is centered via its parent, text is aligned left underneath it */}
                <svg className="absolute w-[120%] -top-4 md:-top-8 -z-10" viewBox="0 0 800 200">
                    <defs>
                        <linearGradient id="swooshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F26522" />
                            <stop offset="25%" stopColor="#E50081" />
                            <stop offset="50%" stopColor="#00AEEF" />
                            <stop offset="100%" stopColor="#FFC107" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d="M -50 100 Q 150 -20, 400 100 T 850 100"
                        fill="transparent"
                        stroke="url(#swooshGradient)"
                        strokeWidth="40"
                        strokeLinecap="round"
                        variants={swooshVariants}
                    />
                </svg>

                {/* M Power Title */}
                <motion.div className="flex items-center gap-2" variants={mPowerVariants}>
                     <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#0033A1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        position: 'relative',
                        flexShrink: 0
                     }}>
                        M
                        <div style={{
                            position: 'absolute',
                            bottom: '0px',
                            left: '5px',
                            width: '0',
                            height: '0',
                            borderLeft: '5px solid transparent',
                            borderRight: '5px solid transparent',
                            borderTop: '10px solid #0033A1',
                            transform: 'rotate(-45deg) translate(-5px, -2px)'
                        }} />
                     </div>
                    <h2 className="text-xl md:text-3xl font-semibold text-brand-dark-blue">POWER</h2>
                </motion.div>

                {/* Main YOUTHOPIA Title */}
                <div className="relative">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tight flex items-end" aria-label="YOUTHOPIA!">
                        {youthopiaText.map((item, index) => (
                            <motion.span
                                key={index}
                                variants={index < 5 ? youthLetterVariants : opiaLetterVariants}
                                style={{ color: item.color }}
                                aria-hidden="true"
                            >
                                {item.char}
                            </motion.span>
                        ))}
                        {/* Paintbrush as exclamation mark */}
                        <motion.span variants={iconVariants} className="ml-1 md:ml-2 text-[0.8em]" style={{color: '#0033A1', transform: 'translateY(-0.1em)'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-auto">
                                <path d="M14.16 2.53a1 1 0 00-1.41.05L5.71 10H4a1 1 0 00-1 1v4a1 1 0 001 1h1.71l-1.42 1.41a1 1 0 000 1.42A1 1 0 005 19h1.36l-1.1 1.1a1 1 0 001.42 1.42L18.09 9.9a1 1 0 00.05-1.41L14.16 2.53zM15 15.5c-1.12 1.12-2.88 1.12-4 0s-1.12-2.88 0-4c1.12-1.12 2.88-1.12 4 0s1.12 2.88 0 4z" />
                                <path d="M20.71 2.29a1 1 0 00-1.42 0l-2.42 2.42a1 1 0 000 1.42 1 1 0 001.42 0l2.42-2.42a1 1 0 000-1.42z" />
                            </svg>
                        </motion.span>
                    </h1>
                     {/* Guitar icon */}
                    <motion.div variants={iconVariants} className="absolute bottom-[-5%] right-[10%] md:bottom-[-2%] md:right-[12%] text-[2em] md:text-[2.5em] w-auto h-[1em]" style={{color: '#0033A1', transform: 'rotate(-15deg)'}}>
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                           <path d="M21.383,3.313A1,1,0,0,0,20.6,3.1L12.55,1.758a1,1,0,0,0-.9.4L4.1,10.7a1,1,0,0,0,0,1.414l7.071,7.071a1,1,0,0,0,1.414,0L21.121,10.65a1,1,0,0,0,.195-.892ZM11.914,17.828l-5.657-5.657,6.364-6.364,5.657,5.657Zm2.121-8.485a2,2,0,1,1,2.828-2.828A2,2,0,0,1,14.035,9.343Z" />
                         </svg>
                    </motion.div>
                </div>
                
                {/* Tagline */}
                <motion.p
                    className="mt-2 md:mt-4 text-base md:text-xl font-medium text-brand-dark-blue/80 tracking-widest self-center"
                    variants={taglineVariants}
                >
                    Unplug. Unleash. Unwind.
                </motion.p>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
