import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import { myroutes } from "../../../routes/routes";
import { successToast } from "../../../utils/toastr";
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";

const ResetPasswordPage = () => {

    const location = useLocation(); 
    const navigate = useNavigate();

    // Récupère les données passées depuis la page OTP
    const { email, otp } = location.state || {};

    useEffect(() => {
        if (!otp || !email) {
            navigate(myroutes.login);
        }
    }, [otp, email, navigate]);

    /// - États locaux pour stocker les inputs
    const [formData, setFormData] = useState({
        otp: otp || '',
        new_password: '',
        confirm_password: ''
    });

    /// - États pour l'UI et loading
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');


    /// - Gestion des changements d'input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Effacer l'erreur si l'utilisateur tape
        if (error) setError('');
    };


    const validatePassword = () => {
        if (!formData.new_password) {
          setError('Le mot de passe est requis');
          return false;
        }
        if (formData.new_password.length < 8) {
          setError('Le mot de passe doit contenir au moins 8 caractères');
          return false;
        }
        if (!/[A-Z]/.test(formData.new_password)) {
            setError('Le mot de passe doit contenir une majuscule');
            return false;
        }
        if (!/[0-9]/.test(formData.new_password)) {
            setError('Le mot de passe doit contenir un chiffre');
            return false;
        }
        if (formData.new_password !== formData.confirm_password) {
          setError('Les mots de passe ne correspondent pas');
          return false;
        }
        return true;
    };


    /// - Soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validatePassword()) return;

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await AuthService.resetPassword({
                email: email,
                otp: formData.otp,
                new_password: formData.new_password,
                confirm_password: formData.confirm_password
            });

            if (response.status === 201 || response.status === 200) {
                //console.log(response);
                setSuccess(true);
                // Redirection vers la page login
                setTimeout(() => {
                    navigate(myroutes.login);
                }, 2000);
                successToast(response.data.message);
            }
        } catch (error) {
            //console.log(error);
            /// - Gestion des erreurs backend
            const errorMessage = error.response?.data?.message || 
                error.response?.data?.error || 
                error.message || 
                'Erreur lors de l\'inscription';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-orange-100 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-amber-100 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
          </div>
    
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-orange-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h2>
              <p className="text-gray-600">Créez un mot de passe sécurisé</p>
            </div>
    
            <div className="space-y-5">
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span>Mot de passe modifié avec succès !</span>
                  </div>
                </div>
              )}
    
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </div>
              )}
    
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="new_password"
                  placeholder="Nouveau mot de passe"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-orange-50 border border-orange-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
                  disabled={loading || success}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
    
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-orange-50 border border-orange-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
                  disabled={loading || success}
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
    
              <div className="bg-orange-50 rounded-xl p-4 text-sm text-gray-700">
                <p className="font-semibold mb-2">Votre mot de passe doit contenir :</p>
                <ul className="space-y-1 ml-4">
                  <li className={formData.new_password.length >= 8 ? 'text-green-600' : ''}>• Au moins 8 caractères</li>
                  <li className={/[A-Z]/.test(formData.new_password) ? 'text-green-600' : ''}>• Une majuscule</li>
                  <li className={/[0-9]/.test(formData.new_password) ? 'text-green-600' : ''}>• Un chiffre</li>
                </ul>
              </div>
    
              <button
                onClick={handleSubmit}
                disabled={loading || success || !formData.new_password || !formData.confirm_password}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </button>
            </div>
          </div>
        </div>
      );
}
export default ResetPasswordPage