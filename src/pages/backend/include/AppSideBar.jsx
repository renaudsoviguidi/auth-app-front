import React from 'react';
import { Activity, FileText, LayoutDashboard, LogOut, Settings, Shield, Users, X } from 'lucide-react';
import { myroutes } from '../../../routes/routes';
import { useNavigate } from 'react-router-dom';


const AppSideBar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Déconnexion...');
    };

    const handleMenuClick = (path) => {
        navigate(path);
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: myroutes.dashboard },
        { id: 'users', label: 'Utilisateurs', icon: Users, path: myroutes.index_users },
        { id: 'roles', label: 'Rôles & Permissions', icon: Shield, path: "/admin/roles/index" },
        { id: 'activity', label: 'Activité', icon: Activity, path: "/admin/roles/index" },
        { id: 'reports', label: 'Rapports', icon: FileText, path: "/admin/roles/index" },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: "/admin/roles/index" }
    ];

    const user = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Administrateur',
        avatar: null
    };

    return (
        <div>
            {/* Overlay pour mobile */}
            {sidebarOpen && (
                <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                w-64 bg-white border-r border-gray-200 
                transition-transform duration-300 ease-in-out
                flex flex-col
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">AuthSystem</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                >
                    <X className="w-5 h-5" />
                </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                    <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                    );
                })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Déconnexion</span>
                </button>
                </div>
            </aside>
        </div>
    );
};
export default AppSideBar