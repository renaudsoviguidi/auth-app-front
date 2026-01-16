import React, { useState } from 'react';
import { 
  Save, 
  Bell, 
  Lock, 
  Globe, 
  Palette, 
  Mail, 
  Shield,
  Clock,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import AppLayout from './include/AppLayout';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    // Général
    siteName: 'AuthSystem',
    siteDescription: 'Système de gestion d\'authentification et d\'autorisation',
    language: 'fr',
    timezone: 'Africa/Porto-Novo',
    
    // Notifications
    emailNotifications: true,
    loginAlerts: true,
    weeklyReport: false,
    securityAlerts: true,
    
    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiration: '90',
    maxLoginAttempts: '5',
    
    // Apparence
    theme: 'light',
    primaryColor: '#f97316',
    
    // Email
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'noreply@example.com',
    smtpPassword: '',
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Sauvegarde des paramètres:', settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'email', label: 'Email', icon: Mail },
  ];

  return (
    <AppLayout>
        <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
          <p className="text-gray-600">Configurez votre système selon vos préférences</p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Paramètres sauvegardés avec succès!</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              
              {/* Général */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres Généraux</h2>
                    <p className="text-gray-600 mb-6">Configuration de base de votre système</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du site
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Langue
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Fuseau horaire
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="Africa/Porto-Novo">Africa/Porto-Novo (GMT+1)</option>
                        <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                        <option value="America/New_York">America/New_York (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
                    <p className="text-gray-600 mb-6">Gérez vos préférences de notification</p>
                  </div>

                  {[
                    { key: 'emailNotifications', label: 'Notifications par email', desc: 'Recevoir des notifications générales par email' },
                    { key: 'loginAlerts', label: 'Alertes de connexion', desc: 'Être alerté lors de nouvelles connexions' },
                    { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Recevoir un résumé des activités chaque semaine' },
                    { key: 'securityAlerts', label: 'Alertes de sécurité', desc: 'Être notifié des événements de sécurité importants' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={(e) => handleInputChange(item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-amber-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Sécurité */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Sécurité</h2>
                    <p className="text-gray-600 mb-6">Renforcez la sécurité de votre système</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        <Shield className="w-4 h-4 inline mr-2" />
                        Authentification à deux facteurs
                      </p>
                      <p className="text-sm text-gray-600">Ajouter une couche de sécurité supplémentaire</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-amber-500"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Délai d'expiration de session (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration du mot de passe (jours)
                      </label>
                      <input
                        type="number"
                        value={settings.passwordExpiration}
                        onChange={(e) => handleInputChange('passwordExpiration', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tentatives de connexion maximales
                    </label>
                    <input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Apparence */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Apparence</h2>
                    <p className="text-gray-600 mb-6">Personnalisez l'apparence de votre interface</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thème
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'light', label: 'Clair' },
                        { value: 'dark', label: 'Sombre' },
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => handleInputChange('theme', theme.value)}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            settings.theme === theme.value
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900">{theme.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur principale
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="w-20 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration Email</h2>
                    <p className="text-gray-600 mb-6">Paramètres SMTP pour l'envoi d'emails</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Serveur SMTP
                      </label>
                      <input
                        type="text"
                        value={settings.smtpHost}
                        onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="smtp.example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Port SMTP
                      </label>
                      <input
                        type="text"
                        value={settings.smtpPort}
                        onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Utilisateur SMTP
                    </label>
                    <input
                      type="email"
                      value={settings.smtpUser}
                      onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="noreply@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe SMTP
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={settings.smtpPassword}
                        onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
};

export default SettingsPage;