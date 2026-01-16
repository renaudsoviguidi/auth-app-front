import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Activity, Calendar, Filter, Search, Download, Clock, User, Shield, Settings, Trash2, Edit2, Eye, LogIn, LogOut, UserPlus, UserMinus } from 'lucide-react';
import { checkAuthenticate } from '../../app/providers/authSlice';
import { myroutes } from '../../routes/routes';
import AppLayout from './include/AppLayout';

const ActivityPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticate);

  useEffect(() => {
    dispatch(checkAuthenticate());
    if (!isAuthenticated) {
      navigate(myroutes.login);
    }
  }, [dispatch, isAuthenticated, navigate]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('today');

  const [activities, setActivities] = useState([
    { id: 1, user: 'Marie Dubois', email: 'marie.dubois@example.com', action: 'Connexion réussie', type: 'login', timestamp: '2024-01-14 14:35:22', ip: '192.168.1.45', details: 'Authentification via mot de passe' },
    { id: 2, user: 'Jean Martin', email: 'jean.martin@example.com', action: 'Création d\'utilisateur', type: 'create', timestamp: '2024-01-14 14:28:15', ip: '192.168.1.67', details: 'Nouvel utilisateur: sophie.laurent@example.com' },
    { id: 3, user: 'Sophie Laurent', email: 'sophie.laurent@example.com', action: 'Modification de rôle', type: 'update', timestamp: '2024-01-14 14:15:42', ip: '192.168.1.89', details: 'Rôle modifié: Éditeur → Administrateur' },
    { id: 4, user: 'Pierre Dupont', email: 'pierre.dupont@example.com', action: 'Suppression d\'utilisateur', type: 'delete', timestamp: '2024-01-14 13:58:30', ip: '192.168.1.23', details: 'Utilisateur supprimé: ancien.user@example.com' },
    { id: 5, user: 'Marie Dubois', email: 'marie.dubois@example.com', action: 'Modification de permission', type: 'update', timestamp: '2024-01-14 13:45:18', ip: '192.168.1.45', details: 'Permission ajoutée: users.delete' },
    { id: 6, user: 'Admin System', email: 'admin@example.com', action: 'Sauvegarde système', type: 'system', timestamp: '2024-01-14 13:30:00', ip: 'SYSTEM', details: 'Sauvegarde automatique effectuée' },
    { id: 7, user: 'Jean Martin', email: 'jean.martin@example.com', action: 'Consultation de rapport', type: 'view', timestamp: '2024-01-14 13:12:45', ip: '192.168.1.67', details: 'Rapport consulté: Statistiques mensuelles' },
    { id: 8, user: 'Sophie Laurent', email: 'sophie.laurent@example.com', action: 'Déconnexion', type: 'logout', timestamp: '2024-01-14 12:55:33', ip: '192.168.1.89', details: 'Déconnexion normale' },
    { id: 9, user: 'Pierre Dupont', email: 'pierre.dupont@example.com', action: 'Modification de paramètres', type: 'settings', timestamp: '2024-01-14 12:40:21', ip: '192.168.1.23', details: 'Paramètres de notification mis à jour' },
    { id: 10, user: 'Marie Dubois', email: 'marie.dubois@example.com', action: 'Exportation de données', type: 'export', timestamp: '2024-01-14 12:25:10', ip: '192.168.1.45', details: 'Export CSV: Liste des utilisateurs' },
  ]);

  const activityTypes = [
    { value: 'all', label: 'Toutes les activités', icon: Activity },
    { value: 'login', label: 'Connexions', icon: LogIn },
    { value: 'logout', label: 'Déconnexions', icon: LogOut },
    { value: 'create', label: 'Créations', icon: UserPlus },
    { value: 'update', label: 'Modifications', icon: Edit2 },
    { value: 'delete', label: 'Suppressions', icon: UserMinus },
    { value: 'view', label: 'Consultations', icon: Eye },
    { value: 'system', label: 'Système', icon: Settings },
  ];

  const dateFilters = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'all', label: 'Tout' },
  ];

  const getActivityIcon = (type) => {
    const icons = {
      login: LogIn,
      logout: LogOut,
      create: UserPlus,
      update: Edit2,
      delete: Trash2,
      view: Eye,
      system: Settings,
      settings: Settings,
      export: Download
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colors = {
      login: 'bg-green-100 text-green-700',
      logout: 'bg-gray-100 text-gray-700',
      create: 'bg-blue-100 text-blue-700',
      update: 'bg-orange-100 text-orange-700',
      delete: 'bg-red-100 text-red-700',
      view: 'bg-purple-100 text-purple-700',
      system: 'bg-cyan-100 text-cyan-700',
      settings: 'bg-indigo-100 text-indigo-700',
      export: 'bg-pink-100 text-pink-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = [
    { label: 'Total Activités', value: activities.length, color: 'from-orange-500 to-amber-500', icon: Activity },
    { label: 'Connexions', value: activities.filter(a => a.type === 'login').length, color: 'from-green-500 to-emerald-500', icon: LogIn },
    { label: 'Modifications', value: activities.filter(a => a.type === 'update').length, color: 'from-blue-500 to-cyan-500', icon: Edit2 },
    { label: 'Suppressions', value: activities.filter(a => a.type === 'delete').length, color: 'from-red-500 to-rose-500', icon: Trash2 },
  ];

  const exportToCSV = () => {
    console.log('Export des activités en CSV...');
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Journal d'Activités</h1>
              <p className="text-sm sm:text-base text-gray-500">Suivez toutes les actions effectuées dans le système</p>
            </div>
          </div>
          <button
            onClick={exportToCSV}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">Exporter</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 border border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les activités..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {dateFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setFilterType(type.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    filterType === type.value
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Détails</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Date & Heure</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden xl:table-cell">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);
                return (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {activity.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{activity.user}</p>
                          <p className="text-xs text-gray-500">{activity.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                          <Icon className="w-3 h-3" />
                          {activity.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm text-gray-600 max-w-md">{activity.details}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {activity.timestamp}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden xl:table-cell">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{activity.ip}</code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune activité trouvée</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ActivityPage;