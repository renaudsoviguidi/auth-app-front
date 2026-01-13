import { useEffect, useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, ArrowRightCircle, Loader2, ArrowRightCircleIcon, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { myroutes } from '../../routes/routes';
import { errorToast } from '../../utils/toastr';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthenticate, loginUser } from '../../app/providers/authSlice';

const CodeOtpPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const location = useLocation();  /// - Pour récupérer les données passées
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticate);

    useEffect(() => {
      // Vérifier si l'utilisateur est connecté lors du chargement de l'application
      dispatch(checkAuthenticate());
      if (isAuthenticated) {
        navigate(myroutes.dashboard);
      } else {
        console.log("not authenticate : " + isAuthenticated);
      }
    }, [dispatch, isAuthenticated, navigate]);


    /// - Récupération sécurisée du username passé depuis la page d'inscription
    const username = location.state?.username;
    const maskedUsername = username && username.includes('@')
    ? username.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : 'adminsite@yopmail.com';

    /// - États pour l'UI et loading
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleVerifyOtp = async (event) => {
        event.preventDefault();

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Veuillez entrer un code à 6 chiffres');
            errorToast('Code incomplet');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);
        

        try {
            const response = await AuthService.verifyLoginOTP({ username, otp: otpCode });

            if (response.status === 201 || response.status === 200) {

                const data = response.data;
                dispatch(loginUser({
                  user: data.user,
                  token: data.token,
                  refreshToken: data.refreshToken,
                  roles: data.user.roles,
                  habilitations: data.user.habilitations,
                }));


                setSuccess(true);
                /// - Redirection vers la page OTP
                setTimeout(() => {
                    navigate(myroutes.dashboard);
                }, 2000);
            }
        } catch (error) {
            /// - Gestion des erreurs backend
            const errorMessage = error.response?.data?.message || 
                error.response?.data?.error || 
                error.message || 
                'Code OTP invalide ou expiré';

                setError(errorMessage);
                //errorToast(errorMessage);
            } finally {
                setLoading(false);
            }
    
    };

    // Retour à la page précédente
    const handleBack = () => {
        navigate(myroutes.login);
    };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
      </div>

      <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-orange-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Vérification OTP</h2>
          <p className="text-gray-600">Un code a été envoyé à <br />
          <span className="font-semibold text-gray-900">{maskedUsername}</span></p>
        </div>

        {/* Message de succès */}
        {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span>Vérification réussie ! Redirection...</span>
                </div>
            </div>
        )}

        {/* Message d'erreur */}
        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">{error}</p>
            </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp?.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
              />
            ))}
          </div>

          <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Vérification en cours...
                    </>
                ) : (
                    <>
                        Vérifier le code
                        <ArrowRightCircleIcon className="w-5 h-5" />
                    </>
                )}
            </button>

          <button
            onClick={handleBack}
            className="w-full text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Retour à la connexion
          </button>

          <p className="text-center text-gray-600 text-sm">
            Vous n avez pas reçu le code?{' '}
            <button className="text-orange-600 hover:text-orange-700 font-semibold">
              Renvoyer
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
export default CodeOtpPage