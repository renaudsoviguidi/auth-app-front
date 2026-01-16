import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Activity, Calendar, Filter, Search, Download, Clock, User, Shield, Settings, Trash2, Edit2, Eye, LogIn, LogOut, UserPlus, UserMinus } from 'lucide-react';
import { checkAuthenticate } from '../../app/providers/authSlice';
import { myroutes } from '../../routes/routes';
import AppLayout from './include/AppLayout';
import ActivitiesService from '../../services/ActivitiesService';

const ActivityPage = () => {

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticate);


  /// - Etats pour les statistiques
  const [stats, setStats] = useState({
    total_activities: 0,
    connexions: 0,
    modifications: 0,
    suppressions: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('today');
  /// - Loader pour les statistiques
  const [loadingStats, setLoadingStats] = useState(true);
  const [loading, setLoading] = useState(true);

  /// - Charger les stats
  const fetchStatistiques = async () => {
    try {
      /// - Charger directement les stats
      setLoadingStats(true);

      /// - Récupérer l'endpoint
      const response = await ActivitiesService.stats(token);

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("Erreur API:", error.response.status, error.response.data);
      } else {
        console.error("Erreur réseau ou autre:", error.message);
      }
    } finally {
      setLoadingStats(false);
    }
  }

  /// - Charger les activités avec filtres
  const fetchActivities = async () => {
    try {
        setLoading(true);

        const params = {
            type: filterType !== 'all' ? filterType : undefined,
            search: searchTerm || undefined,
            date: filterDate !== 'all' ? filterDate : undefined,
        };

        const response = await ActivitiesService.list(params, token);
        if (response.data.success) {
            setActivities(response.data.data);
        }

    } catch (error) {
        console.error("Erreur chargement activités:", error);
    } finally {
        setLoading(false);
    }
  }

  const [activities, setActivities] = useState([]);
/* 
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
  ]; */

  // Icônes et couleurs
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

  /* const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesType;
  }); */

  // Stats dynamiques
  const dynamicStats = [
    { label: 'Total Activités', value: stats.total_activities, color: 'from-orange-500 to-amber-500', icon: Activity },
    { label: 'Connexions', value: stats.connexions, color: 'from-green-500 to-emerald-500', icon: LogIn },
    { label: 'Modifications', value: stats.modifications, color: 'from-blue-500 to-cyan-500', icon: Edit2 },
    { label: 'Suppressions', value: stats.suppressions, color: 'from-red-500 to-rose-500', icon: Trash2 },
  ];

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcul de la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };


  const exportToCSV = () => {
    console.log('Export des activités en CSV...');
  };


  /// - Fonction useEffect pour charger les données directement sur les pages
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté lors du chargement de l'application
    dispatch(checkAuthenticate());
    if (!isAuthenticated) {
      /// - Redirection vers login
      navigate(myroutes.login);
    }

    /// - Charger les fonctions
    fetchStatistiques();
    fetchActivities();
  }, [dispatch, isAuthenticated, navigate, token, searchTerm, filterDate, filterType]);

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
      {loadingStats ? (
          <>Chargement des statistiques...</>
        ) : (
            dynamicStats.map((stat, index) => {
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
            })
          )}
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
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="all">Tout</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
          {[
              { value: 'all', label: 'Toutes', icon: Activity },
              { value: 'login', label: 'Connexions', icon: LogIn },
              { value: 'create', label: 'Créations', icon: UserPlus },
              { value: 'update', label: 'Modifications', icon: Edit2 },
              { value: 'delete', label: 'Suppressions', icon: Trash2 },
              { value: 'export', label: 'Exports', icon: Download },
            ].map((type) => {
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
      {loading ? (
          <div className="text-center py-12">Chargement des activités...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune activité trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Détails</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Date & Heure</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden xl:table-cell">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const colorClass = getActivityColor(activity.type);
                  const userName = activity.user ? `${activity.user.last_name?.toUpperCase()} ${activity.user.first_name}` : 'Système';
                  const email = activity.user?.email || '';

                  return (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{userName}</p>
                            <p className="text-xs text-gray-500">{email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                          <Icon className="w-3 h-3" />
                          {activity.action}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell text-sm text-gray-600">{activity.details}</td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {new Date(activity.timestamp).toLocaleString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden xl:table-cell">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{activity.ip_address || 'N/A'}</code>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Contrôles de pagination */}
        {!loading && activities.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-200 text-sm">
            <div className="text-gray-700 mb-2 sm:mb-0">
              Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, activities.length)} sur {activities.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Précédent
              </button>
              <span className="px-3 py-1">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ActivityPage;