import { Edit2, Loader2, Lock, Plus, Search, Shield, Trash2, Users, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AppLayout from '../include/AppLayout';
import RolesService from '../../../services/RolesService';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkAuthenticate } from '../../../app/providers/authSlice';
import { myroutes } from '../../../routes/routes';
import HabilitationsService from '../../../services/HabilitationsService';
import { dangerToast, errorToast, successToast } from '../../../utils/toastr';

const RolesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedRole, setSelectedRole] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
  
    const [roles, setRoles] = useState([]);
    const [habilitations, setHabilitations] = useState([]);

    /// - État (un objet qui track par role.id)
    const [expandedRoles, setExpandedRoles] = useState({});

    const token = useSelector((state) => state.auth.token);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticate);

    /// - Etats pour les statistiques
    const [stats, setStats] = useState({
      roles_count: 0,
      users_count: 0,
      habilitations_count: 0,
      users_by_role: []
    });

    /// - Construire un map { roleId → users_total }
    const usersCountByRole = React.useMemo(() => {
      const map = {};
      stats.users_by_role.forEach(item => {
        map[item.id] = item.users_total;
      });
      return map;
    }, [stats.users_by_role]);

    /// - Loader pour les statistiques
    const [loadingStats, setLoadingStats] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    /// - Fonction pour charger les statistiques depuis le backend
    const fetchStatistiques = async () => {
      try {
        /// - Charger directement les stats
        setLoadingStats(true);

        /// - Récupérer l'endpoint
        const response = await RolesService.stats_roles(token);

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

    /// - Fonction pour charger les rôles
    const fetchRoles = async () => {
      try {
        /// - Charger directement les rôles
        setLoading(true);

        const response = await RolesService.index(token);
        if (response.data.success && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        }
        
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    }

    const fetchHabilitations = async () => {
      try {
        /// - Charger directement les rôles
        setLoading(true);

        const response = await HabilitationsService.index(token);
        
        if (response.data.success && Array.isArray(response.data.data)) {
          setHabilitations(response.data.data);
        }
        
      } catch (error) {
        console.error("Erreur lors du chargement des habilitations:", error);
      } finally {
        setLoading(false);
      }
    }

    const filteredRoles = roles.filter(role =>
      role.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /// - Helper pour toggle pour afficher les habilitations reliées au rôle
    /// - quand on clique sur +x
    const toggleExpanded = (roleId) => {
      setExpandedRoles(prev => ({
        ...prev,
        [roleId]: !prev[roleId]
      }));
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
      fetchRoles();
      fetchHabilitations();
    }, [dispatch, isAuthenticated, navigate, token]);
  
    const [formData, setFormData] = useState({
      libelle: '',
      description: '',
      habilitation_ids: []
    });
  
    const colorOptions = [
      { value: 'orange', bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      { value: 'blue', bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      { value: 'green', bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      { value: 'purple', bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      { value: 'pink', bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' }
    ];
  
    const openCreateModal = () => {
      setModalMode('create');
      setFormData({ libelle: '', description: '', habilitation_ids: [] });
      setShowModal(true);
    };
  
    const openEditModal = (role) => {
      setModalMode('edit');
      setSelectedRole(role);
      setFormData({
        libelle: role.libelle,
        description: role.description,
        habilitation_ids: (role.habilitations || []).map(h => h.id)
      });
      setShowModal(true);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.libelle.trim()) return;

      setIsSubmitting(true);
      setError('');

      try {
        if (modalMode === 'create') {
          const response = await RolesService.store(formData, token);

          if (response.data.success) {
            successToast(response.data.message);
            setSuccess(true);
            await fetchRoles(); // recharge la liste
            setShowModal(false);
            setFormData({
              libelle: '',
              description: '',
              habilitation_ids: []
            });
          }

        } else {
          const ref = selectedRole?.ref;
          if (!ref) throw new Error("Référence du rôle manquante");

          const response = await RolesService.update(ref, formData, token);

          if (response.data.success) {
            successToast(response.data.message);
            setSuccess(true);
            await fetchRoles(); // recharge la liste
            setShowModal(false);
          }

        }
      } catch (error) {
        /// - Gestion des erreurs backend
          const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          (modalMode === 'create' ? "Erreur lors de la création" : "Erreur lors de la modification");

          errorToast(errorMessage);
          setError(errorMessage);
      }finally {
        setIsSubmitting(false);
      }
      //setShowModal(false);
    };
  
    const handleDelete = (ref) => {
      dangerToast("Voulez-vous vraiment supprimer cet élément ?").then((result) => {
        if (result.isConfirmed) {
          RolesService.delete(ref, token)
            .then((response) => {
              successToast(response.data.message);
              fetchRoles();
            })
            .catch((err) => {
              let errorMessage;
    
              if (err.response) {
                const status = err.response.status;
    
                if (status === 204) {
                  successToast("Rôle supprimé avec succès!!");
                  fetchRoles();
                  return;
                }
    
                errorMessage =
                  err.response.data?.message ||
                  err.response.data?.error ||
                  `Erreur ${status}`;
              } else {
                errorMessage = err.message || "Erreur réseau";
              }
    
              errorToast(errorMessage);
            });
        }
      });
    };
  
    const togglePermission = (habilitationId) => {
      setFormData(prev => ({
        ...prev,
        habilitation_ids: prev.habilitation_ids.includes(habilitationId)
          ? prev.habilitation_ids.filter(id => id !== habilitationId)
          : [...prev.habilitation_ids, habilitationId]
      }));
    };
  
    const getColorClasses = (color) => {
      return colorOptions.find(c => c.value === color) || colorOptions[0];
    };
  
    
  
    return (
      <AppLayout>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Rôles & Permissions</h1>
                <p className="text-gray-500">Gérez les rôles et leurs permissions</p>
              </div>
            </div>
          </div>
  
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loadingStats ? "-" : stats.roles_count}</p>
                  <p className="text-sm text-gray-500">Rôles actifs</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? "-" : stats.users_count}
                  </p>
                  <p className="text-sm text-gray-500">Utilisateurs</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                  {loadingStats ? "-" : stats.habilitations_count}
                  </p>
                  <p className="text-sm text-gray-500">Permissions</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Actions Bar */}
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un rôle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={openCreateModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Nouveau rôle</span>
              </button>
            </div>
          </div>
  
          {/* Roles Grid */}
          {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement des rôles...</div>
          ) : filteredRoles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun rôle trouvé
            </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoles.map((role) => {
                  const colorClasses = getColorClasses(role.color);
                  return (
                    <div key={role.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className={`h-2 ${colorClasses.bg.replace('100', '500')}`} />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`px-3 py-1 ${colorClasses.bg} ${colorClasses.text} rounded-lg text-sm font-medium`}>
                            {role.libelle}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(role)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(role.ref)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 min-h-[3rem]">
                          {role.description || <span className="text-gray-400 italic">Pas de description</span>}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Users className="w-4 h-4" />
                          <span>
                          {usersCountByRole[role.id] ?? 0} utilisateur
                          {(usersCountByRole[role.id] ?? 0) > 1 ? 's' : ''}
                          </span>
                        </div>
      
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                          {(role.habilitations || []).length} permission
                          {(role.habilitations || []).length > 1 ? 's' : ''}
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {(() => {
                              const habs = role.habilitations || [];
                              const isExpanded = expandedRoles[role.id] || false;
                              const displayed = isExpanded ? habs : habs.slice(0, 3);

                              return (
                                <>
                                  {displayed.map((perm) => (
                                    <span
                                      key={perm.id}
                                      className="px-2.5 py-1 bg-indigo-50 text-gray-700 text-xs font-medium rounded-full"
                                    >
                                      {perm.libelle}
                                    </span>
                                  ))}

                                  {!isExpanded && habs.length > 3 && (
                                    <button
                                      onClick={() => toggleExpanded(role.id)}
                                      className="px-2.5 py-1 bg-gray-100 text-black-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                      title="Voir toutes les habilitations"
                                    >
                                      +{habs.length - 3}
                                    </button>
                                  )}

                                  {isExpanded && habs.length > 3 && (
                                    <button
                                      onClick={() => toggleExpanded(role.id)}
                                      className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
                                      title="Réduire"
                                    >
                                      Voir moins
                                    </button>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
          )}
          
  
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Créer un rôle' : 'Modifier le rôle'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
  
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-green-800 text-sm">{success}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Libellé <i className='text-red-600'>*</i>
                    </label>
                    <input
                      type="text"
                      value={formData.libelle}
                      onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: Gestionnaire"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Décrivez les responsabilités de ce rôle..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Habilitations ({formData.habilitation_ids.length} sélectionnée{formData.habilitation_ids.length > 1 ? 's' : ''})
                    </label>
                    <div className="max-h-80 overflow-y-auto">
                      {habilitations.length === 0 ? (
                        <p className="text-sm text-gray-500 py-6 text-center">
                          Aucune habilitation chargée...
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {habilitations.map((hab) => (
                            <label
                              key={hab.id}
                              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={formData.habilitation_ids.includes(hab.id)}
                                onChange={() => togglePermission(hab.id)}
                                className="w-5 h-5 mt-0.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                              />
                              <div>
                                <div className="font-medium text-gray-800 text-sm">{hab.libelle}</div>
                                {hab.description && (
                                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                                    {hab.description}
                                  </div>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
  
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      {isSubmitting ? (
                          <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Création du rôle...
                          </>
                      ) : (
                          <>
                              {modalMode === 'create' ? 'Créer' : 'Enregistrer'}
                          </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    );
};

export default RolesPage;