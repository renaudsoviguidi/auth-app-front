import React from "react";
import { Bell, Menu, Search } from 'lucide-react';


const AppHeader = ({ sidebarOpen, setSidebarOpen }) => {
    const user = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Administrateur',
        avatar: null
    };

    return (
        <div>
            {sidebarOpen && (
            <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            />
        )}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-3">
                {/* Menu button pour mobile */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-sm text-gray-600 mt-1 hidden sm:block">Bienvenue, {user.name}</p>
                </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                {/* Search - caché sur très petits écrans */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 w-32 sm:w-48 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 text-sm"
                    />
                </div>
                
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                </div>
            </div>
        </header>
        </div>
    );
};
export default AppHeader