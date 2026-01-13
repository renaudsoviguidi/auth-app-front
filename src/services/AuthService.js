import http from "./http";

class AuthService {
    register(data) {
        return http.post("/api/v01/web/register", data);
    }

    login(data) {
        return http.post("/api/v01/web/login", data);
    }

    verifyLoginOTP(data) {
        return http.post("/api/v01/web/verify_login_otp", data);
    }

    forgotPassword(data) {
        return http.post("/api/v01/web/forgot-password", data);
    }

    verifyOtp(data) {
        return http.post("/api/v01/web/verify_otp", data);
    }

    resetPassword(data) {
        return http.post("/api/v01/web/password-reset/confirm/", data);   
    }
}

export default new AuthService