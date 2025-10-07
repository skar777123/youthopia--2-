import * as React from "react";
import {
  motion,
  animate,
  useMotionValue,
  Variants,
  AnimatePresence
} from "framer-motion";

// --- IN-FILE COMPONENTS to resolve import errors ---

// Replacing react-icons/fi with inline SVGs
const FiGift: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
);
const FiX: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
const FiAward: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
);

const AnimatedCounter: React.FC<{ to: number; className?: string }> = ({ to, className }) => {
    const count = useMotionValue(0);
    const rounded = useMotionValue(0);
    
    React.useEffect(() => {
        const animation = animate(count, to, { duration: 1 });
        const unsubscribe = count.on("change", (latest) => {
            rounded.set(Math.round(latest));
        });
        return () => {
            unsubscribe();
            animation.stop();
        };
    }, [to, count, rounded]);

    return <motion.span className={className}>{rounded}</motion.span>;
};

const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}></div>
);


// --- Configuration & Constants ---
const prizeSegments = [
  { points: 5, color: "#6366f1" },  // Indigo
  { points: 10, color: "#8b5cf6" }, // Violet
  { points: 2, color: "#ec4899" },  // Pink
  { points: 20, color: "#f59e0b" }, // Amber
  { points: 5, color: "#6366f1" },  // Indigo
  { points: 15, color: "#10b981" }, // Emerald
  { points: 2, color: "#ec4899" },  // Pink
  { points: 25, color: "#ef4444" }, // Red
];
const SEGMENT_COUNT = prizeSegments.length;
const SEGMENT_ANGLE_DEG = 360 / SEGMENT_COUNT;
const WHEEL_RADIUS = 90;

// --- Animation Variants ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemSpringUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// --- Web Audio API Sound Helpers ---
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
  if (typeof window !== 'undefined' && !audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const playTickSound = () => {
  const context = getAudioContext();
  if (!context) return;
  try {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    gain.gain.setValueAtTime(0.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.05);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.05);
  } catch (e) {
    console.error("Could not play sound:", e);
  }
};

const playWinSound = () => {
    const context = getAudioContext();
    if (!context) return;
    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
      oscillator.frequency.linearRampToValueAtTime(1046.50, context.currentTime + 0.2); // C6
      gain.gain.setValueAtTime(0.2, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.4);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.4);
    } catch(e) {
        console.error("Could not play win sound:", e);
    }
}


// --- Helper Function for SVG Arc Path ---
const getSegmentPath = (index: number): string => {
  const startAngle = (SEGMENT_ANGLE_DEG * index - 90) * (Math.PI / 180);
  const endAngle = (SEGMENT_ANGLE_DEG * (index + 1) - 90) * (Math.PI / 180);
  const startX = 100 + WHEEL_RADIUS * Math.cos(startAngle);
  const startY = 100 + WHEEL_RADIUS * Math.sin(startAngle);
  const endX = 100 + WHEEL_RADIUS * Math.cos(endAngle);
  const endY = 100 + WHEEL_RADIUS * Math.sin(endAngle);
  return `M 100 100 L ${startX} ${startY} A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 1 ${endX} ${endY} Z`;
};


// --- Child Components ---

// User type definition for props
type User = {
  visaPoints: number;
  spinsAvailable: number;
  pointsHistory: { timestamp: number; reason: string; points: number }[];
};

const PrizeWheel: React.FC<{ onSpinComplete: (prize: { points: number }) => void; user: User | null; useSpin: () => void }> = ({ onSpinComplete, user, useSpin }) => {
  const [isSpinning, setIsSpinning] = React.useState(false);
  const rotation = useMotionValue(0);
  const lastTickAngle = React.useRef(0);

  const handleSpin = () => {
    if (!user || user.spinsAvailable <= 0 || isSpinning) return;
    setIsSpinning(true);
    useSpin();
    const randomSpins = 5 + Math.random() * 5;
    const prizeIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    const prize = prizeSegments[prizeIndex];
    const currentRotation = rotation.get();
    const targetRotation = (randomSpins * 360) + (currentRotation - (currentRotation % 360)) - (prizeIndex * SEGMENT_ANGLE_DEG) - (SEGMENT_ANGLE_DEG / 2);

    animate(rotation, targetRotation, {
      type: "spring", stiffness: 25, damping: 20, mass: 1.5,
      onUpdate: (latest) => {
        const anglePerTick = SEGMENT_ANGLE_DEG / 2;
        if (Math.abs(latest - lastTickAngle.current) > anglePerTick) {
          playTickSound();
          lastTickAngle.current = latest;
        }
      },
      onComplete: () => {
        onSpinComplete(prize);
        setIsSpinning(false);
      },
    });
  };
  
  if (!user) return null;

  return (
    <motion.div
      variants={itemSpringUp}
      className="flex flex-col items-center justify-around bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 md:p-6 min-h-[480px]"
    >
      <div className="relative w-56 h-56 sm:w-60 sm:h-60 md:w-64 md:h-64">
        <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-10" style={{ filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.3))" }}>
          <svg width="30" height="42" viewBox="0 0 20 30"><polygon points="0,0 20,0 10,30" className="fill-yellow-400" /></svg>
        </div>
        
        <motion.svg viewBox="0 0 200 200" className="w-full h-full" style={{ rotate: rotation }}>
          <defs><filter id="shadow"><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="rgba(0,0,0,0.2)" /></filter></defs>
          <g filter="url(#shadow)">
            {prizeSegments.map((segment, i) => {
              const midAngleDeg = SEGMENT_ANGLE_DEG * i + (SEGMENT_ANGLE_DEG / 2);
              const midAngleRad = (midAngleDeg - 90) * (Math.PI / 180);
              const textRadius = WHEEL_RADIUS * 0.65;
              const textX = 100 + textRadius * Math.cos(midAngleRad);
              const textY = 100 + textRadius * Math.sin(midAngleRad);
              return (
                <g key={i}>
                  <path d={getSegmentPath(i)} fill={segment.color} stroke="#00000020" strokeWidth="0.5" />
                  <text x={textX} y={textY} transform={`rotate(${midAngleDeg}, ${textX}, ${textY})`} fill="white" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}>{segment.points}</text>
                </g>
              );
            })}
          </g>
          <circle cx="100" cy="100" r="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" /><circle cx="100" cy="100" r="6" fill="#6366f1" />
        </motion.svg>
      </div>
      
      <div className="text-center">
        <motion.button onClick={handleSpin} disabled={user.spinsAvailable <= 0 || isSpinning} className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold py-3 px-8 md:px-10 rounded-full text-base md:text-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all duration-300 enabled:hover:shadow-xl enabled:hover:shadow-indigo-500/40 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:from-gray-500 disabled:to-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          whileHover={ user.spinsAvailable > 0 && !isSpinning ? { scale: 1.05, y: -3 } : {} }
          whileTap={ user.spinsAvailable > 0 && !isSpinning ? { scale: 0.98 } : {} }
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel"}
        </motion.button>
        <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
          {user.spinsAvailable} spin{user.spinsAvailable !== 1 ? "s" : ""} available
        </p>
      </div>
    </motion.div>
  );
};

const PointsDisplay: React.FC<{ user: User | null }> = ({ user }) => {
  if (!user) return null;
  return (
    <div className="bg-gray-800 text-white p-5 rounded-lg mb-5 flex items-center justify-between shadow-lg shadow-black/20">
      <div>
        <p className="text-sm text-gray-300 uppercase tracking-wider">Current Balance</p>
        <div className="flex items-baseline gap-2">
          <AnimatedCounter to={user.visaPoints} className="text-4xl font-bold" />
          <span className="font-semibold text-gray-200">Points</span>
        </div>
      </div>
      <FiGift size={40} className="text-yellow-400 opacity-80" />
    </div>
  );
};

const TransactionHistory: React.FC<{ user: User | null }> = ({ user }) => {
  const reversedHistory = React.useMemo(() => user?.pointsHistory ? [...user.pointsHistory].reverse() : [], [user?.pointsHistory]);
  if (!user) return null;
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 px-1">Recent Activity</h4>
      <div className="overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-800/60 rounded-lg p-1 custom-scrollbar">
        <div className="p-3 space-y-1">
          {reversedHistory.length > 0 ? (
            reversedHistory.map((tx, i) => (
              <div key={`${tx.timestamp}-${i}`} className="flex justify-between items-center py-2.5 border-b border-gray-200 dark:border-gray-700/50 last:border-b-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">{tx.reason}</p>
                <p className={`font-bold text-sm ${tx.points > 0 ? "text-green-500" : "text-red-500"}`}>{tx.points > 0 ? "+" : ""}{tx.points}</p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-center text-sm text-gray-500 dark:text-gray-400 py-12">
              <p>No transactions yet. <br/> Spin the wheel to earn points!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PrizeModal: React.FC<{ prize: { points: number } | null; onClose: () => void }> = ({ prize, onClose }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        if (prize && canvasRef.current) {
            playWinSound();
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            let confetti: {x: number, y: number, r: number, d: number, color: string, tilt: number}[] = [];
            const confettiCount = 100;
            const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
            
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            for (let i = 0; i < confettiCount; i++) {
                confetti.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height - canvas.height,
                    r: Math.random() * 4 + 1,
                    d: Math.random() * confettiCount,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    tilt: Math.floor(Math.random() * 10) - 10,
                });
            }

            let animationFrameId: number;
            const draw = () => {
                if(!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                confetti.forEach((p, i) => {
                    ctx.beginPath();
                    ctx.lineWidth = p.r / 2;
                    ctx.strokeStyle = p.color;
                    ctx.moveTo(p.x + p.tilt, p.y);
                    ctx.lineTo(p.x, p.y + p.tilt + p.r / 2);
                    ctx.stroke();
                    p.y += Math.pow(p.d, 0.5) + p.r * 0.5;
                    p.tilt += 0.1;
                    if (p.y > canvas.height) {
                        if (i % 5 > 0 || i % 2 === 0) {
                           confetti[i] = { ...p, x: Math.random() * canvas.width, y: -20, };
                        }
                    }
                });
                animationFrameId = requestAnimationFrame(draw);
            };
            draw();
            return () => cancelAnimationFrame(animationFrameId);
        }
    }, [prize]);

    return (
    <AnimatePresence>
        {prize && (
            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
                <motion.div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-center shadow-2xl relative w-full max-w-sm border border-gray-200 dark:border-gray-700 overflow-hidden" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }} exit={{ scale: 0.7, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
                    <div className="relative z-10">
                        <FiAward size={64} className="mx-auto text-yellow-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300">Congratulations!</h2>
                        <p className="text-lg my-2 text-gray-800 dark:text-gray-200">You won</p>
                        <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 my-4">{prize.points}</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Points!</p>
                        <button onClick={onClose} className="mt-6 bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg transition-transform hover:scale-105 shadow-md">Awesome!</button>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-20"><FiX size={24} /></button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
)};

const VisaPointsPageSkeleton: React.FC = () => (
    <div className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col flex-1">
        <SkeletonLoader className="h-8 w-1/3 rounded-md mb-4 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1">
            <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <SkeletonLoader className="w-64 h-64 rounded-full mb-6 animate-pulse" />
                <SkeletonLoader className="h-12 w-48 rounded-full mb-3 animate-pulse" />
                <SkeletonLoader className="h-4 w-24 rounded-md animate-pulse" />
            </div>
            <div className="flex flex-col">
                <SkeletonLoader className="h-[108px] w-full rounded-lg mb-5 animate-pulse" />
                <SkeletonLoader className="h-6 w-1/4 rounded-md mb-3 animate-pulse" />
                <SkeletonLoader className="w-full rounded-lg flex-1 animate-pulse" />
            </div>
        </div>
    </div>
);


// --- Main Page Component ---
const VisaPointsPage: React.FC = () => {
  // Centralized state management to fix mock implementation and potential bugs
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [wonPrize, setWonPrize] = React.useState<{ points: number } | null>(null);

  React.useEffect(() => {
    // Simulate fetching user data
    const timer = setTimeout(() => {
      setUser({
        visaPoints: 140,
        spinsAvailable: 3,
        pointsHistory: [
          { timestamp: Date.now() - 10000, reason: "Spin Wheel Prize", points: 2 },
          { timestamp: Date.now() - 20000, reason: "Achievement: Points Hoarder", points: 25 },
          { timestamp: Date.now() - 30000, reason: "Spin Wheel Prize", points: 5 },
        ],
      });
      setIsLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  const addPoints = React.useCallback((points: number, reason: string) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        visaPoints: prevUser.visaPoints + points,
        pointsHistory: [...prevUser.pointsHistory, { timestamp: Date.now(), reason, points }]
      };
    });
  }, []);

  const useSpin = React.useCallback(() => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        spinsAvailable: Math.max(0, prevUser.spinsAvailable - 1),
      };
    });
  }, []);
  
  const handleSpinComplete = (prize: { points: number }) => {
    addPoints(prize.points, "Spin Wheel Prize");
    setTimeout(() => setWonPrize(prize), 300);
  };

  if (isLoading) return <VisaPointsPageSkeleton />;
  if (!user) return <div className="p-6 text-center text-gray-600 dark:text-gray-300">Could not load user data.</div>;

  return (
    <>
      <motion.div className="w-full bg-transparent p-4 md:p-6 flex flex-col" variants={staggerContainer} initial="hidden" animate="visible" exit="hidden">
        <motion.h3 variants={itemSpringUp} className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 shrink-0">
          Your VISA Points
        </motion.h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <PrizeWheel onSpinComplete={handleSpinComplete} user={user} useSpin={useSpin} />
          
          <motion.div variants={itemSpringUp} className="flex flex-col min-h-0">
            <PointsDisplay user={user} />
            <TransactionHistory user={user} />
          </motion.div>
        </div>
      </motion.div>
      <PrizeModal prize={wonPrize} onClose={() => setWonPrize(null)} />
    </>
  );
};

export default VisaPointsPage;

