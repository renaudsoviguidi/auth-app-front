import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, Calendar, TrendingUp, Users, Activity, BarChart3, PieChart, Filter } from 'lucide-react';
import { checkAuthenticate } from '../../app/providers/authSlice';
import { myroutes } from '../../routes/routes';
import AppLayout from './include/AppLayout';

const RapportsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticate);

  useEffect(() => {
    dispatch(checkAuthenticate());
    if (!isAuthenticated) {
      navigate(myroutes.login);
    }
  }, [dispatch, isAuthenticated, navigate]);

  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reports = [
    {
      id: 1,
      title: 'Rapport d\'Activité Mensuel',
      description: 'Vue d\'ensemble des activités du mois en cours',
      type: 'activity',
      date: '2024-01-14',
      size: '2.4 MB',
      icon: Activity,
      color: 'from-orange-500 to-amber-500',
      stats: { views: 145, downloads: 23 }
    },
    {
      id: 2,
      title: 'Statistiques Utilisateurs',
      description: 'Analyse détaillée des utilisateurs actifs',
      type: 'users',
      date: '2024-01-14',
      size: '1.8 MB',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      stats: { views: 98, downloads: 15 }
    },
    {
      id: 3,
      title: 'Rapport de Sécurité',
      description: 'Analyse des connexions et tentatives d\'accès',
      type: 'security',
      date: '2024-01-13',
      size: '3.1 MB',
      icon: BarChart3,
      color: 'from-red-500 to-rose-500',
      stats: { views: 67, downloads: 12 }
    },
    {
      id: 4,
      title: 'Performance Système',
      description: 'Métriques de performance et utilisation',
      type: 'performance',
      date: '2024-01-13',
      size: '1.5 MB',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      stats: { views: 89, downloads: 18 }
    },
    {
      id: 5,
      title: 'Rapport Hebdomadaire',
      description: 'Résumé de la semaine passée',
      type: 'weekly',
      date: '2024-01-08',
      size: '2.2 MB',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      stats: { views: 112, downloads: 28 }
    },
    {
      id: 6,
      title: 'Distribution des Rôles',
      description: 'Répartition des utilisateurs par rôle',
      type: 'roles',
      date: '2024-01-07',
      size: '1.2 MB',
      icon: PieChart,
      color: 'from-indigo-500 to-purple-500',
      stats: { views: 76, downloads: 9 }
    },
  ];

  const stats = [
    { label: 'Rapports Disponibles', value: reports.length, color: 'from-orange-500 to-amber-500', icon: FileText },
    { label: 'Vues Totales', value: reports.reduce((sum, r) => sum + r.stats.views, 0), color: 'from-blue-500 to-cyan-500', icon: Eye },
    { label: 'Téléchargements', value: reports.reduce((sum, r) => sum + r.stats.downloads, 0), color: 'from-green-500 to-emerald-500', icon: Download },
    { label: 'Ce Mois', value: reports.filter(r => r.date.startsWith('2024-01')).length, color: 'from-purple-500 to-pink-500', icon: Calendar },
  ];

  const periods = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' },
  ];

  const handleDownload = (report) => {
    console.log('Téléchargement du rapport:', report.title);
  };

  const handleView = (report) => {
    console.log('Affichage du rapport:', report.title);
  };

  return (
    <AppLayout>
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rapports</h1>
            <p className="text-sm sm:text-base text-gray-500">Consultez et téléchargez vos rapports</p>
          </div>
        </div>
      </div>

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

      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-2 bg-gradient-to-r ${report.color}`} />
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${report.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {report.date}
                  </div>
                  <div>{report.size}</div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {report.stats.views} vues
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {report.stats.downloads}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(report)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button
                    onClick={() => handleDownload(report)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default RapportsPage;