import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { checkAuthenticate } from '../../app/providers/authSlice';
import { myroutes } from '../../routes/routes';
import { Activity, BarChart3, Bell, ChevronRight, FileText, Key, LayoutDashboard, Lock, LogOut, Menu, Search, Settings, Shield, Users, X } from 'lucide-react';
import AppLayout from './include/AppLayout';


const DashboardPage = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated =  useSelector((state) => state.auth.isAuthenticate);

    useEffect(() => {
      // Vérifier si l'utilisateur est connecté lors du chargement de l'application
      dispatch(checkAuthenticate());
      if (!isAuthenticated) {
        /// - Redirection vers login
        navigate(myroutes.login);
      }

    }, [dispatch, isAuthenticated, navigate]);

  // Statistiques du dashboard
  const stats = [
    {
      title: 'Utilisateurs Actifs',
      value: '1,284',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-amber-500'
    },
    {
      title: 'Rôles Définis',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Permissions',
      value: '42',
      change: '+5',
      trend: 'up',
      icon: Lock,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Activité',
      value: '98%',
      change: '+3%',
      trend: 'up',
      icon: Activity,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // Activités récentes
  const recentActivities = [
    { user: 'Marie Dubois', action: 'a créé un nouveau rôle', role: 'Éditeur', time: 'Il y a 5 min', type: 'create' },
    { user: 'Jean Martin', action: 'a modifié les permissions', role: 'Modérateur', time: 'Il y a 12 min', type: 'update' },
    { user: 'Sophie Laurent', action: 's\'est connecté', role: 'Utilisateur', time: 'Il y a 23 min', type: 'login' },
    { user: 'Pierre Dupont', action: 'a supprimé un utilisateur', role: 'Admin', time: 'Il y a 1h', type: 'delete' }
  ];



    return (
        <React.Fragment>
          <AppLayout>
            {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-xs sm:text-sm mb-1">{stat.title}</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Activité Récente</h2>
                <button className="text-orange-600 hover:text-orange-700 text-xs sm:text-sm font-medium">
                  Voir tout
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base text-gray-900">
                        <span className="font-semibold">{activity.user}</span>{' '}
                        <span className="text-gray-600">{activity.action}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs sm:text-sm text-orange-600 font-medium">{activity.role}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs sm:text-sm text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Actions Rapides</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all text-sm sm:text-base">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Ajouter Utilisateur</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors text-sm sm:text-base">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Créer Rôle</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors text-sm sm:text-base">
                  <Key className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Gérer Permissions</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors text-sm sm:text-base">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Voir Rapports</span>
                </button>
              </div>

              {/* System Status */}
              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">État du Système</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Serveur</span>
                    <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      En ligne
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Base de données</span>
                    <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Connectée
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">API</span>
                    <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Opérationnelle
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </AppLayout>
      </React.Fragment>
    );
}

export default DashboardPage