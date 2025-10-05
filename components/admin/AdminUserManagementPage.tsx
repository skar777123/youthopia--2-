import * as React from 'react';
import { motion } from 'framer-motion';
import { useAuth, User } from '../../contexts/AuthContext.tsx';
import { FiSearch, FiUserCheck, FiUserX, FiUsers } from 'react-icons/fi';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import Modal from '../Modal.tsx';
import SkeletonLoader from '../SkeletonLoader.tsx';

const UserRow: React.FC<{ user: User; onToggleStatusRequest: (user: User) => void }> = ({ user, onToggleStatusRequest }) => {
    const handleToggle = () => {
        onToggleStatusRequest(user);
    };

    return (
        <motion.tr variants={itemSpringUp} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{user.fullName}</td>
            <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{user.contact}</td>
            <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{user.class} - {user.stream}</td>
            <td className="py-3 px-4 text-sm font-bold text-gray-800 dark:text-gray-200 hidden md:table-cell">{user.visaPoints}</td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className="py-3 px-4">
                <motion.button
                    onClick={handleToggle}
                    className={`p-2 rounded-full transition-colors ${user.active ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50' : 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50'}`}
                    title={user.active ? 'Deactivate User' : 'Activate User'}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {user.active ? <FiUserX /> : <FiUserCheck />}
                </motion.button>
            </td>
        </motion.tr>
    );
};

const SkeletonUserRow: React.FC = () => (
    <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="py-3 px-4"><SkeletonLoader className="h-5 w-3/4 rounded-md" /></td>
        <td className="py-3 px-4"><SkeletonLoader className="h-5 w-full rounded-md" /></td>
        <td className="py-3 px-4 hidden sm:table-cell"><SkeletonLoader className="h-5 w-full rounded-md" /></td>
        <td className="py-3 px-4 hidden md:table-cell"><SkeletonLoader className="h-5 w-1/2 rounded-md" /></td>
        <td className="py-3 px-4"><SkeletonLoader className="h-6 w-16 rounded-full" /></td>
        <td className="py-3 px-4"><SkeletonLoader className="h-8 w-8 rounded-full" /></td>
    </tr>
);

const AdminUserManagementPage: React.FC = () => {
    const { getAllUsers, updateUserStatus } = useAuth();
    const [users, setUsers] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [userToConfirm, setUserToConfirm] = React.useState<User | null>(null);

    const refreshUsers = React.useCallback(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setUsers(getAllUsers());
            setIsLoading(false);
        }, 500); // Simulate fetch
        return () => clearTimeout(timer);
    }, [getAllUsers]);

    React.useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    const handleToggleStatusRequest = (user: User) => {
        setUserToConfirm(user);
    };

    const handleConfirmStatusChange = () => {
        if (userToConfirm) {
            updateUserStatus(userToConfirm.contact, !userToConfirm.active);
            refreshUsers();
            setUserToConfirm(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contact.includes(searchQuery)
    );

    return (
        <motion.div
            className="p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">User Management</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or contact..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Name</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Contact</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 hidden sm:table-cell">Class</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 hidden md:table-cell">Points</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Status</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Action</th>
                            </tr>
                        </thead>
                        <motion.tbody variants={staggerContainer(0.05)}>
                           {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonUserRow key={i} />)
                           ) : filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <UserRow key={user.contact} user={user} onToggleStatusRequest={handleToggleStatusRequest} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <FiUsers className="w-12 h-12 mb-2 text-gray-400" />
                                            <h3 className="font-semibold">No users found</h3>
                                            <p className="text-sm">{searchQuery ? 'No users match your search.' : 'Registered students will appear here.'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </motion.tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={!!userToConfirm} onClose={() => setUserToConfirm(null)}>
                {userToConfirm && (
                    <div className="text-center p-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Confirm Status Change</h3>
                        <p className="my-4 text-gray-600 dark:text-gray-300">
                            Are you sure you want to {userToConfirm.active ? 'deactivate' : 'activate'} the user "{userToConfirm.fullName}"?
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                            <motion.button
                                onClick={() => setUserToConfirm(null)}
                                className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleConfirmStatusChange}
                                className={`px-6 py-2 rounded-full text-white font-semibold transition-colors ${userToConfirm.active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Confirm
                            </motion.button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};

export default AdminUserManagementPage;