import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import { myroutes } from "../../../routes/routes";
import { successToast } from "../../../utils/toastr";
import { AlertCircle, ArrowLeft, CheckCircle, KeyRound, Loader2, Mail } from "lucide-react";

const ForgotPasswordPage = () => {
    
  /// - États locaux pour stocker les inputs
  const [formData, setFormData] = useState({
    email: '',
  });


    /// - États pour l'UI et loading
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Effacer l'erreur si l'utilisateur tape
        if (error) setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /// - Validation du formulaire
    const validateForm = () => {
        if (!formData.email.trim()) {
            setError("L'email est requis");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError("L'email n'est pas valide");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await AuthService.forgotPassword(formData);

            if (response.status === 201 || response.status === 200) {
                setSuccess(true);
                // Redirection vers la page OTP
                setTimeout(() => {
                    navigate(myroutes.forgot_password_otp, {
                        state: { email: formData.email }
                    });
                }, 2000);
                successToast(response.data.message);
            }
        } catch (error) {
            //console.log(error);
            /// - Gestion des erreurs backend
            const errorMessage = error.response?.data?.message || 
                error.response?.data?.error || 
                error.message || 
                'Erreur lors de la connexion';
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-50 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      </div>

      <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-orange-100">
        <button 
          onClick={() => navigate(myroutes.login)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour à la connexion</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié ?</h2>
          <p className="text-gray-600">Entrez votre email pour recevoir un code de vérification</p>
        </div>

        <div className="space-y-5">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span>Code envoyé ! Vérifiez votre email.</span>
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
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Votre email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-4 bg-orange-50 border border-orange-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || success || !formData.email.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              'Envoyer le code'
            )}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-orange-100">
          <p className="text-center text-gray-500 text-sm">
            Vous vous souvenez de votre mot de passe ?{' '}
            <button className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
export default ForgotPasswordPage