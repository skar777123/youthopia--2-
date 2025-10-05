import * as React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './components/HomePage.tsx';
import AuthPage from './components/AuthPage.tsx';
import TestimonialsPage from './components/TestimonialsPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.tsx';
import ActivityVisaPage from './components/ActivityVisaPage.tsx';
import EventDetailPage from './components/EventDetailPage.tsx';
import FeedbackPage from './components/FeedbackPage.tsx';
import AdminLayout from './components/admin/AdminLayout.tsx';
import AdminDashboardPage from './components/admin/AdminDashboardPage.tsx';
import AdminUserManagementPage from './components/admin/AdminUserManagementPage.tsx';
import AdminEventManagementPage from './components/admin/AdminEventManagementPage.tsx';
import AdminFeedbackPage from './components/admin/AdminFeedbackPage.tsx';
import AdminQRPage from './components/admin/AdminQRPage.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';
import QRScannerPage from './components/passport-pages/QRScannerPage.tsx';

const App: React.FC = () => {
    const location = useLocation();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000); // Simulate loading time
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <SplashScreen />;
    }

    const isAdminRoute = location.pathname.startsWith('/admin');
    const isAuthRoute = location.pathname === '/auth';

    return (
        <div className="flex flex-col min-h-screen bg-brand-bg dark:bg-brand-black">
            {!isAdminRoute && <Navbar />}
            <main className="flex-grow">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/testimonials" element={<TestimonialsPage />} />
                        
                        {/* Protected Student Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<ActivityVisaPage />} />
                            <Route path="/event/:eventId" element={<EventDetailPage />} />
                            <Route path="/feedback/:eventId" element={<FeedbackPage />} />
                            <Route path="/qr-scanner/:eventId" element={<QRScannerPage />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminProtectedRoute />}>
                            <Route element={<AdminLayout />}>
                                <Route index element={<Navigate to="dashboard" replace />} />
                                <Route path="dashboard" element={<AdminDashboardPage />} />
                                <Route path="users" element={<AdminUserManagementPage />} />
                                <Route path="events" element={<AdminEventManagementPage />} />
                                <Route path="feedback" element={<AdminFeedbackPage />} />
                                <Route path="qr" element={<AdminQRPage />} />
                            </Route>
                        </Route>

                    </Routes>
                </AnimatePresence>
            </main>
            {!isAdminRoute && !isAuthRoute && <Footer />}
            <ScrollToTopButton />
        </div>
    );
};

export default App;