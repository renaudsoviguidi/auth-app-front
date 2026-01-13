import React, { useEffect, useState } from 'react';
import { Users, Plus, Search, Filter, MoreVertical, Edit2, Trash2, Mail, Phone, Calendar, Shield, X, Eye, EyeOff, AlertCircle, UserPlus, TrendingDown, Loader2, ArrowRightIcon, CheckCircle } from 'lucide-react';
import AppLayout from '../include/AppLayout';
import UsersService from '../../../services/UsersService';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RolesService from '../../../services/RolesService';
import { checkAuthenticate } from '../../../app/providers/authSlice';
import { myroutes } from '../../../routes/routes';
import { dangerToast, errorToast, successToast } from '../../../utils/toastr';

const UsersPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // États dynamiques depuis l'API
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticate);

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  /// - États pour les statistiques utilisateurs
  const [stats, setStats] = useState({
    global: { total: 0, active: 0, inactive: 0, active_percent: 0 },
    monthly: { this_month: 0, evolution_percent: 0, evolution_text: "0 ce mois" },
    daily: { today: 0, text: "0 aujourd'hui" }
  });

  const [loadingStats, setLoadingStats] = useState(true);

  /// - Fonction pour charger les statistiques depuis le backend
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await UsersService.count(token);
  
      if (response.data.success ) {
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
  };

  /// - Charger les rôles
  const fetchRoles = async () => {
    try {
      const response = await RolesService.index(token);

      if (response.data.success && Array.isArray(response.data.data)) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rôles:", error);
    }
  } 

  /// - Charger les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await UsersService.index(token);

      if (response.data.success && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    }
  } 

  

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté lors du chargement de l'application
    dispatch(checkAuthenticate());
    if (!isAuthenticated) {
      /// - Redirection vers login
      navigate(myroutes.login);
    }

    if (token) {
      fetchStats();
      fetchRoles();
      fetchUsers();
    }
  }, [dispatch, isAuthenticated, navigate, token]);

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    // Recherche par prénom, nom, nom complet, username ou email
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim().toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchSearch = 
      (user.first_name || '').toLowerCase().includes(searchLower) ||
      (user.last_name || '').toLowerCase().includes(searchLower) ||
      fullName.includes(searchLower) ||
      (user.username || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower);

    // Extraction de l'ID du premier rôle
    const hasSelectedRole = () => {
      if (selectedRole === 'all') return true;

      if (!user.roles) return false;

      if (Array.isArray(user.roles)) {
        return user.roles.some(role => {
          if (typeof role === 'object') {
            return String(role.id) === String(selectedRole);
          }
          return String(role) === String(selectedRole);
        });
      }

      return String(user.roles) === String(selectedRole);
    };

    const matchRole = hasSelectedRole();

    return matchSearch && matchRole;
  });

  // Composant Modal d'ajout d'utilisateur
  const AddUserModal = () => {
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password2: '',
      role_ids: []
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
      if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';
      
      if (!formData.email.trim()) {
        newErrors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
      
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      
      if (formData.password !== formData.password2) {
        newErrors.password2 = 'Les mots de passe ne correspondent pas';
      }

      if (!formData.role_ids || formData.role_ids.length === 0) {
        newErrors.role_ids = 'Veuillez sélectionner au moins un rôle';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setLoading(true);
      setError('');
      setSuccess(false);

      try {
        const response = await UsersService.store(formData, token);

        if (response.data.success) {
          setSuccess(true);
          await fetchUsers(); // recharge la liste
          setShowAddModal(false);
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password2: '',
            role_ids: roles.length > 0 ? roles[0].id : ''
          });
          successToast(response.data.message);
          setErrors({});
        }

      } catch (error) {
        /// - Gestion des erreurs backend
        const errorMessage = error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Erreur lors de l\'ajout de l\'utilisateur';
        errorToast(errorMessage);
        setError(errorMessage);
      }finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Nouvel Utilisateur</h2>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Message de succès */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-5 h-5" />
                        <span>Utilisateur créé avec succès. Un mail a été envoyé contenant le code d'activation de votre compte.</span>
                    </div>
                </div>
            )}

            {/* Message d'erreur */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500`}
                  placeholder="Jean"
                />
                {errors.first_name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500`}
                  placeholder="Dupont"
                />
                {errors.last_name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500`}
                  placeholder="jean.dupont@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rôles * (plusieurs possibles)
              </label>

              {/* Zone d'affichage des rôles sélectionnés (comme des tags) */}
              {formData.role_ids.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {roles
                    .filter(role => formData.role_ids.includes(String(role.id))) // String() pour sécurité
                    .map(role => (
                      <span
                        key={role.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        {role.libelle}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              role_ids: prev.role_ids.filter(id => id !== String(role.id))
                            }));
                            // Efface l'erreur si elle existe
                            if (errors.role_ids) {
                              setErrors(prev => ({ ...prev, role_ids: '' }));
                            }
                          }}
                          className="ml-1 hover:text-orange-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                </div>
              )}

              {/* Liste des rôles avec checkboxes */}
              <div className="border rounded-xl bg-white overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  {roles.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      Aucun rôle disponible
                    </div>
                  ) : (
                    roles.map(role => {
                      const isChecked = formData.role_ids.includes(String(role.id));
                      return (
                        <label
                          key={role.id}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                            ${isChecked 
                              ? 'bg-orange-50 border-l-4 border-orange-500' 
                              : 'hover:bg-gray-50'
                            }`}
                        >
                          <input
                            type="checkbox"
                            name="role_ids"
                            value={role.id}
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  role_ids: [...prev.role_ids, String(role.id)]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  role_ids: prev.role_ids.filter(id => id !== String(role.id))
                                }));
                              }
                              // Efface l'erreur quand l'utilisateur commence à cocher
                              if (errors.role_ids) {
                                setErrors(prev => ({ ...prev, role_ids: '' }));
                              }
                            }}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 focus:ring-2 border-gray-300"
                          />
                          <div className="flex items-center gap-3 flex-1">
                            <Shield className={`w-5 h-5 ${isChecked ? 'text-orange-600' : 'text-gray-400'}`} />
                            <div>
                              <p className={`font-medium ${isChecked ? 'text-gray-900' : 'text-gray-700'}`}>
                                {role.libelle}
                              </p>
                              {role.description && (
                                <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Message d'aide */}
              <p className="mt-2 text-sm text-gray-500">
                Cochez un ou plusieurs rôles pour l'utilisateur
              </p>

              {/* Erreur */}
              {errors.role_ids && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.role_ids}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border ${errors.password2 ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password2 && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.password2}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                    type="submit"
                    disabled={loading || formData.password !== formData.password2 || formData.role_ids.length === 0}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Création du compte...
                        </>
                    ) : (
                        <>
                            Ajouter l'utilisateur
                            <ArrowRightIcon className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditUserModal = () => {
    const [formData, setFormData] = useState({
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      is_active: currentUser?.is_active ?? false,
      role_ids: currentUser?.roles ? currentUser.roles.map(r => String(typeof r === 'object' ? r.id : r)) : [],
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
      if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';
      
      if (!formData.email.trim()) {
        newErrors.email = "L'email est requis";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
  
      if (formData.role_ids.length === 0) {
        newErrors.role_ids = 'Veuillez sélectionner au moins un rôle';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      setLoading(true);
      setError('');
  
      try {
        const response = await UsersService.update(currentUser.ref, formData, token);
  
        if (response.data.success) {
          successToast("Utilisateur modifié avec succès");
          await fetchUsers();
          setShowEditModal(false);
          setCurrentUser(null);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || "Erreur lors de la modification";
        errorToast(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };
  
    if (!showEditModal || !currentUser) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Edit2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Modifier l'utilisateur</h2>
            </div>
            <button
              onClick={() => {
                setShowEditModal(false);
                setCurrentUser(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom <i className='text-red-500'>*</i></label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50`}
                  />
                  {errors.last_name && <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom <i className='text-red-500'>*</i></label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50`}
                  />
                  {errors.first_name && <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>}
                </div>
            </div>
  
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email <i className='text-red-500'>*</i></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50`}
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>
  
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rôles <i className='text-red-500'>*</i></label>
              {formData.role_ids.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {roles
                    .filter(role => formData.role_ids.includes(String(role.id)))
                    .map(role => (
                      <span key={role.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
                        <Shield className="w-4 h-4" />
                        {role.libelle}
                        <button type="button" onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            role_ids: prev.role_ids.filter(id => id !== String(role.id))
                          }));
                        }}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                </div>
              )}
  
              <div className="border rounded-xl bg-white overflow-hidden max-h-60 overflow-y-auto">
                {roles.map(role => {
                  const isChecked = formData.role_ids.includes(String(role.id));
                  return (
                    <label key={role.id} className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${isChecked ? 'bg-orange-50 border-l-4 border-orange-500' : 'hover:bg-gray-50'}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, role_ids: [...prev.role_ids, String(role.id)] }));
                          } else {
                            setFormData(prev => ({ ...prev, role_ids: prev.role_ids.filter(id => id !== String(role.id)) }));
                          }
                        }}
                        className="w-5 h-5 text-orange-500 rounded"
                      />
                      <div>
                        <p className="font-medium">{role.libelle}</p>
                        {role.description && <p className="text-xs text-gray-500">{role.description}</p>}
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.role_ids && <p className="mt-2 text-sm text-red-600">{errors.role_ids}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Compte actif ?
                </label>

                <div className="flex items-center gap-6">
                  {/* OUI */}
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_active"
                      value={true}
                      checked={formData.is_active === true}
                      onChange={() => setFormData(prev => ({ ...prev, is_active: true }))}   
                      className="text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700">Oui</span>
                  </label>

                  {/* NON */}
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_active"
                      value={false}
                      checked={formData.is_active === false}
                      onChange={() => setFormData(prev => ({ ...prev, is_active: false }))}
                      className="text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700">Non</span>
                  </label>
                </div>

                {errors.is_active && (
                  <p className="mt-2 text-sm text-red-600">{errors.is_active}</p>
                )}
              </div>
            </div>
 
  
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium">
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sauvegarder"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Tableau de libellés pour tous les rôles de l'utilisateur
  const getUserRolesLibelles = (user) => {
    if (!user.roles || (Array.isArray(user.roles) && user.roles.length === 0)) {
      return ['Non défini'];
    }

    const roleLibelles = [];

    if (Array.isArray(user.roles)) {
      user.roles.forEach(role => {
        if (typeof role === 'object' && role.libelle) {
          roleLibelles.push(role.libelle);
        } else if (typeof role === 'string') {
          // Si c'est un ID ou un nom, on cherche dans la liste des rôles chargés
          const foundRole = roles.find(r => 
            String(r.id) === String(role) || r.libelle === role
          );
          roleLibelles.push(foundRole ? foundRole.libelle : role);
        }
      });
    } else if (typeof user.roles === 'string') {
      const foundRole = roles.find(r => String(r.id) === user.roles || r.libelle === user.roles);
      roleLibelles.push(foundRole ? foundRole.libelle : user.roles);
    }

    return roleLibelles.length > 0 ? roleLibelles : ['Non défini'];
  };

  const getFullName = (user) => `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Utilisateur';

  /// - Supression d'un élément
  const onDelete = (ref) => {
    //confirm action
    dangerToast("Voulez-vous vraiment supprimer cet élément ?").then(
      (result) => {
        if (result.isConfirmed) {
          UsersService.delete(ref, token)
            .then((response) => {
              if (response.data.success) {
                successToast(response.data.message);
              } else {
                errorToast(response.data.message);
                fetchUsers();
              }
            })
            .catch((err) => {
              const errorMessage = err.response?.data?.message || err.response?.data?.error || "Erreur lors de la supression";
              errorToast(errorMessage);
              setError(errorMessage);
            });
        }
      }
    );
  };


  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-1">Gérez les comptes et permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Nouvel Utilisateur
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500"
          >
            <option value="all">Tous les rôles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.libelle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Utilisateurs */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-blue-100 text-sm mb-1">Total Utilisateurs</p>
                <p className="text-3xl font-bold">
                {loadingStats ? '-' : stats.global.total}
                </p>
            </div>
            <Users className="w-10 h-10 text-blue-200" />
            </div>
        </div>

        {/* Actifs */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-green-100 text-sm mb-1">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold">
                {loadingStats ? '-' : stats.global.active}
                </p>
                <p className="text-green-200 text-sm mt-1">
                {loadingStats ? '' : `${stats.global.active_percent}% du total`}
                </p>
            </div>
            <div className="w-10 h-10 bg-green-400/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
            </div>
            </div>
        </div>

        {/* Ce mois */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-orange-100 text-sm mb-1">Nouveaux ce mois</p>
                <p className="text-3xl font-bold">
                {loadingStats ? '-' : `+${stats.monthly.this_month}`}
                </p>
                <div className="flex items-center gap-1 mt-2">
                {stats.monthly.evolution_percent > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-300" />
                ) : stats.monthly.evolution_percent < 0 ? (
                    <TrendingDown className="w-4 h-4 text-red-300" />
                ) : null}
                <p className="text-sm text-orange-100">
                    {loadingStats ? '' : stats.monthly.evolution_percent > 0 
                    ? `+${stats.monthly.evolution_percent}%` 
                    : stats.monthly.evolution_percent < 0 
                    ? `${stats.monthly.evolution_percent}%` 
                    : 'Stable'}
                </p>
                </div>
            </div>
            <UserPlus className="w-10 h-10 text-orange-200" />
            </div>
        </div>

        {/* Aujourd'hui */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-purple-100 text-sm mb-1">Inscriptions aujourd'hui</p>
                <p className="text-3xl font-bold">
                {loadingStats ? '-' : `+${stats.daily.today}`}
                </p>
            </div>
            <Calendar className="w-10 h-10 text-purple-200" />
            </div>
        </div>
    </div>
            

      {/* Tableau / Cartes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ajouté le</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {getFullName(user).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{getFullName(user)}</p>
                        <p className="text-sm text-gray-500">{user.username || user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {getUserRolesLibelles(user).map((libelle, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700"
                        >
                          <Shield className="w-4 h-4" />
                          {libelle}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setCurrentUser(user);
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => onDelete(user.ref)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredUsers.map(user => (
            <div key={user.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {getFullName(user).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{getFullName(user)}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {getUserRolesLibelles(user).map((libelle, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {libelle}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddUserModal />
      <EditUserModal />
    </AppLayout>
  );
};

export default UsersPage;