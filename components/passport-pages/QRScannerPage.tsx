import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Event } from '../../data/events.ts';
import { FiCamera, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

const QRScannerPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { events, completeEvent } = useAuth();
    const [event, setEvent] = React.useState<Event | null>(null);
    const [status, setStatus] = React.useState<ScanStatus>('idle');
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
        const currentEvent = events.find(e => e.id === eventId);
        if (currentEvent) {
            setEvent(currentEvent);
            if (currentEvent.completed) {
                // If already completed, redirect away
                navigate(`/event/${eventId}`, { replace: true });
            }
        } else {
            navigate('/dashboard', { replace: true });
        }
    }, [eventId, events, navigate]);

    const handleMockScan = () => {
        if (!event) return;

        setStatus('scanning');
        setErrorMessage('');

        // Simulate a network delay and scanning process
        setTimeout(() => {
            // Mock QR code data for the current event
            const mockQrCodeData = `YOUTHOPIA-COMPLETE-${event.id}`;
            const scannedEventId = mockQrCodeData.replace('YOUTHOPIA-COMPLETE-', '');

            if (scannedEventId === event.id) {
                setStatus('success');
                completeEvent(event.id);
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 1500);
            } else {
                setStatus('error');
                setErrorMessage('QR Code does not match this event. Please try again.');
                setTimeout(() => setStatus('idle'), 3000);
            }
        }, 2000);
    };

    if (!event) return null;

    const statusIcons: Record<ScanStatus, React.ReactNode> = {
        idle: <FiCamera className="h-24 w-24 text-gray-400" />,
        scanning: <FiLoader className="h-24 w-24 text-brand-blue animate-spin" />,
        success: <FiCheckCircle className="h-24 w-24 text-green-500" />,
        error: <FiXCircle className="h-24 w-24 text-red-500" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-160px)]"
        >
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark-blue dark:text-gray-100">Complete Event</h1>
                <p className="text-md sm:text-lg text-brand-blue dark:text-gray-400 mt-2 mb-6">Scan the official QR code for "{event.name}" to mark it as completed.</p>

                <div className="relative w-64 h-64 mx-auto bg-gray-100 dark:bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center mb-6">
                    <div className="absolute top-2 left-2 w-10 h-10 border-t-4 border-l-4 border-brand-teal rounded-tl-md"></div>
                    <div className="absolute top-2 right-2 w-10 h-10 border-t-4 border-r-4 border-brand-teal rounded-tr-md"></div>
                    <div className="absolute bottom-2 left-2 w-10 h-10 border-b-4 border-l-4 border-brand-teal rounded-bl-md"></div>
                    <div className="absolute bottom-2 right-2 w-10 h-10 border-b-4 border-r-4 border-brand-teal rounded-br-md"></div>
                    {statusIcons[status]}
                </div>

                {status === 'success' && <p className="font-semibold text-green-600 dark:text-green-400">Success! Event completed.</p>}
                {status === 'error' && <p className="font-semibold text-red-600 dark:text-red-400">{errorMessage}</p>}
                
                <motion.button
                    onClick={handleMockScan}
                    disabled={status !== 'idle'}
                    className="mt-4 w-full max-w-xs mx-auto bg-brand-yellow text-brand-dark-blue font-bold py-3 px-8 rounded-full text-lg flex items-center justify-center hover:bg-yellow-300 transition-colors duration-200 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    whileHover={status === 'idle' ? { scale: 1.05 } : {}}
                    whileTap={status === 'idle' ? { scale: 0.95 } : {}}
                >
                    <FiCamera className="mr-2" />
                    {status === 'scanning' ? 'Scanning...' : 'Start Scan'}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default QRScannerPage;
