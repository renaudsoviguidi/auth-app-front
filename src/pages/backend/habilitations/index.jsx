import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Lock, Search, Plus, Edit2, Trash2, X, AlertCircle, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { checkAuthenticate } from '../../../app/providers/authSlice';
import { myroutes } from '../../../routes/routes';
import AppLayout from '../include/AppLayout';
import HabilitationsService from '../../../services/HabilitationsService';
import { errorToast, successToast } from '../../../utils/toastr';

const HabilitationsPage = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticate);


  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedHabilitation, setSelectedHabilitation] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [habilitationToDelete, setHabilitationToDelete] = useState(null);

  const [habilitations, setHabilitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    libelle: '',
    description: ''
  });

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ libelle: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (habilitation) => {
    setModalMode('edit');
    setSelectedHabilitation(habilitation);
    setFormData({
      libelle: habilitation.libelle,
      description: habilitation.description
    });
    setShowModal(true);
  };

  /// - Validation du formulaire
  const validateForm = () => {
    if (!formData.libelle.trim()) {
        setError("Le libellé est requis");
        return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      if (modalMode === 'create') {
        const response = await HabilitationsService.store(formData, token);

        if (response.data.success) {
          successToast(response.data.message);
          setSuccess(true);
          await fetchHabilitations(); // recharge la liste
          setShowModal(false);
          setFormData({
            libelle: '',
            description: '',
            habilitation_ids: []
          });
        }

      } else {
        const ref = selectedHabilitation?.ref;
        if (!ref) throw new Error("Référence de l'habilitation manquante");

        const response = await HabilitationsService.update(ref, formData, token);

        if (response.data.success) {
          successToast(response.data.message);
          setSuccess(true);
          await fetchHabilitations(); // recharge la liste
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

  const confirmDelete = (habilitation) => {
    setHabilitationToDelete(habilitation);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!habilitationToDelete) return;
  
    const ref = habilitationToDelete?.ref;
    if (!ref) {
      errorToast("Impossible de supprimer : référence manquante");
      return;
    }
  
    setIsDeleting(true);
  
    try {
      const response = await HabilitationsService.delete(ref, token);
  
      if (response.status === 204) {
        successToast(response.data.message || "Habilitation supprimée avec succès");
  
        setHabilitations(prev => 
          prev.filter(h => h.ref !== ref)
        );
        await fetchHabilitations();
  
        setShowDeleteConfirm(false);
        setHabilitationToDelete(null);
      } else {
        throw new Error(response.data.message || "Échec de la suppression");
      }
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de la suppression de l'habilitation";
  
      errorToast(errorMessage);
      console.error("Erreur suppression:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredHabilitations = habilitations.filter(habilitation => {
    const searchLower = searchTerm.toLowerCase();
    return habilitation.libelle.toLowerCase().includes(searchLower) ||
           habilitation.description.toLowerCase().includes(searchLower);
  });

  // Calcul de la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHabilitations.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredHabilitations.length / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

   /// - Charger les habilitations
   const fetchHabilitations = async () => {
    try {
        /// - Charger directement les rôles
        setLoading(true);

        const response = await HabilitationsService.index(token);

        if (response.data.success && Array.isArray(response.data.data)) {
            setHabilitations(response.data.data);
        }
    } catch (error) {
      console.error("Erreur lors du chargement des habiliatations:", error);
    } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté lors du chargement de l'application
    dispatch(checkAuthenticate());
    if (!isAuthenticated) {
      /// - Redirection vers login
      navigate(myroutes.login);
    }

    fetchHabilitations();
    setCurrentPage(1);

  }, [dispatch, isAuthenticated, navigate, searchTerm]);
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Habilitations</h1>
            <p className="text-sm sm:text-base text-gray-500">Gérez toutes les habilitations du système</p>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une habilitation..."
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
            <span className="font-medium">Nouvelle habilitation</span>
          </button>
        </div>
      </div>

      {/* Habilitations Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Chargement des habilitations...
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm
                  ? "Aucune habilitation ne correspond à votre recherche"
                  : "Aucune habilitation trouvée"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase w-16">#</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Libellé</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Description</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Date modification</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((habilitation, index) => (
                  <tr key={habilitation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-sm font-medium text-gray-500">
                        #{indexOfFirstItem + index + 1}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{habilitation.libelle}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 md:hidden">{habilitation.description}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-600">{habilitation.description}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {habilitation.updated_at
                        ? new Date(habilitation.updated_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                            })
                        : '—'}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(habilitation)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(habilitation)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Contrôles de pagination */}
        {!loading && filteredHabilitations.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-200 text-sm">
            <div className="text-gray-700 mb-2 sm:mb-0">
              Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredHabilitations.length)} sur {filteredHabilitations.length}
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Créer une habilitation' : 'Modifier l\'habilitation'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Message de succès */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-green-800">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Habilitation {modalMode === 'create' ? 'créé' : 'modifiée'} avec succès</span>
                                </div>
                            </div>
                        )}

                        {/* Message d'erreur */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Libellé <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="text"
                        value={formData.libelle}
                        onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                        placeholder="Ex: Créer des utilisateurs"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                        </label>
                        <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        placeholder="Décrivez cette habilitation..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        />
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
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Création de l'habilitation...
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
                <p className="text-sm text-gray-500">Cette action est irréversible</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'habilitation <strong>"{habilitationToDelete?.libelle}"</strong> ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {isDeleting ? (
                    <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Suppression...
                    </>
                ) : (
                    "Supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default HabilitationsPage;