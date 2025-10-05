import * as React from "react";
import { motion, animate } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { staggerContainer, itemSpringUp } from "../../utils/animations.ts";
import { FiGift } from "react-icons/fi";
import AnimatedCounter from "../AnimatedCounter.tsx";
import SkeletonLoader from "../SkeletonLoader.tsx";

const prizeSegments = [
  { points: 5, color: "#6366f1" },
  { points: 10, color: "#8b5cf6" },
  { points: 2, color: "#ec4899" },
  { points: 20, color: "#f59e0b" },
  { points: 5, color: "#6366f1" },
  { points: 15, color: "#10b981" },
  { points: 2, color: "#ec4899" },
  { points: 25, color: "#ef4444" },
];

const VisaPointsPageSkeleton: React.FC = () => (
  <motion.div
    className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <SkeletonLoader className="h-8 w-1/3 rounded-md mb-4" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <SkeletonLoader className="w-48 h-48 md:w-64 md:h-64 rounded-full mb-4" />
        <SkeletonLoader className="h-12 w-48 rounded-full mb-2" />
        <SkeletonLoader className="h-4 w-24 rounded-md" />
      </div>
      <div className="flex flex-col">
        <SkeletonLoader className="h-28 w-full rounded-lg mb-4" />
        <SkeletonLoader className="h-6 w-1/4 rounded-md mb-2" />
        <div className="overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const VisaPointsPage: React.FC = () => {
  const { user, addPoints, useSpin } = useAuth();
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [finalRotation, setFinalRotation] = React.useState(0);
  const wheelRef = React.useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  const handleSpin = () => {
    if (!user || user.spinsAvailable <= 0 || isSpinning) return;

    setIsSpinning(true);
    useSpin();

    const totalSpins = 5 + Math.random() * 3; // 5 to 8 full rotations
    const segmentAngle = 360 / prizeSegments.length;
    const prizeIndex = Math.floor(Math.random() * prizeSegments.length);
    const prize = prizeSegments[prizeIndex];

    const targetRotation =
      totalSpins * 360 - prizeIndex * segmentAngle - segmentAngle / 2;

    animate(finalRotation, targetRotation, {
      type: "spring",
      stiffness: 20,
      damping: 15,
      onUpdate: (latest) => {
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${latest}deg)`;
        }
        setFinalRotation(latest);
      },
      onComplete: () => {
        addPoints(prize.points, "Spin Wheel Prize");
        setIsSpinning(false);
      },
    });
  };

  const Transaction: React.FC<{ reason: string; points: number }> = ({
    reason,
    points,
  }) => (
    <div className="flex justify-between items-center py-2 border-b border-brand-passport-subtle/20">
      <p className="text-sm text-brand-passport-primary dark:text-gray-300">
        {reason}
      </p>
      <p
        className={`font-bold text-sm ${
          points > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {points > 0 ? "+" : ""}
        {points}
      </p>
    </div>
  );

  if (isLoading) {
    return <VisaPointsPageSkeleton />;
  }

  if (!user) return null;

  return (
    <motion.div
      className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col"
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.h3
        variants={itemSpringUp}
        className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100 mb-4 border-b-2 border-brand-passport-subtle dark:border-gray-700 pb-2"
      >
        Your VISA Points
      </motion.h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[400px] overflow-hidden">
        <motion.div
          variants={itemSpringUp}
          className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4  "
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4 ">
            <svg
              viewBox="0 0 200 200"
              ref={wheelRef}
              style={{ transform: `rotate(${finalRotation}deg)` }}
            >
              {prizeSegments.map((segment, i) => (
                <g
                  key={i}
                  transform={`rotate(${
                    (360 / prizeSegments.length) * i
                  }, 100, 100)`}
                >
                  <path
                    d="M100 100 L180 100 A80 80 0 0 0 154.2 38.6 Z"
                    fill={segment.color}
                  />
                  <text
                    x="145"
                    y="105"
                    transform={`rotate(22.5, 145, 105)`}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {segment.points}
                  </text>
                </g>
              ))}
            </svg>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+10px)]"
              style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.4))" }}
            >
              <svg width="20" height="30" viewBox="0 0 20 30">
                <polygon points="0,0 20,0 10,30" fill="#FFC759" />
              </svg>
            </div>
          </div>
          <motion.button
            onClick={handleSpin}
            disabled={user.spinsAvailable <= 0 || isSpinning}
            className="bg-brand-passport-accent text-brand-passport-primary font-bold py-3 px-8 rounded-full text-lg flex items-center justify-center shadow-lg transition-all duration-200 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed"
            whileHover={
              user.spinsAvailable > 0 && !isSpinning
                ? { scale: 1.05, y: -2 }
                : {}
            }
            whileTap={
              user.spinsAvailable > 0 && !isSpinning ? { scale: 0.98 } : {}
            }
          >
            {isSpinning ? "Spinning..." : "Spin the Wheel"}
          </motion.button>
          <p className="mt-2 text-sm font-semibold text-brand-passport-subtle dark:text-gray-400">
            {user.spinsAvailable} spin{user.spinsAvailable !== 1 ? "s" : ""}{" "}
            available
          </p>
        </motion.div>

        <motion.div variants={itemSpringUp} className="flex flex-col">
          <div className="bg-brand-dark-blue text-white p-4 rounded-lg mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Current Balance</p>
              <div className="flex items-baseline gap-2">
                <AnimatedCounter
                  to={user.visaPoints}
                  className="text-4xl font-bold"
                />
                <span className="font-semibold">Points</span>
              </div>
            </div>
            <FiGift size={40} className="text-brand-yellow" />
          </div>
          <h4 className="font-bold text-brand-passport-primary dark:text-gray-200 mb-2">
            Recent Activity
          </h4>
          <div className="overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 pr-2 -mr-2">
            {user.pointsHistory.length > 0 ? (
              [...user.pointsHistory]
                .reverse()
                .map((tx, i) => (
                  <Transaction
                    key={`${tx.timestamp}-${i}`}
                    reason={tx.reason}
                    points={tx.points}
                  />
                ))
            ) : (
              <div className="text-center text-sm text-brand-passport-subtle dark:text-gray-400 py-8">
                No transactions yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VisaPointsPage;
