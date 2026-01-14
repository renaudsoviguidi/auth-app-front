import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { myroutes } from './routes';
import LoginPage from '../pages/auth/LoginPage';
import App from '../App';
import RegisterPage from '../pages/auth/RegisterPage';
import CodeOtpPage from '../pages/auth/OtpCodePage';
import DashboardPage from '../pages/backend/dashboard';
import ForgotPasswordPage from '../pages/auth/password/forgotPasswordPage';
import ForgotPasswordCodeOtpPage from '../pages/auth/password/ForgotPasswordCodeOtpPage';
import ResetPasswordPage from '../pages/auth/password/ResetPasswordPage';
import UsersPage from '../pages/backend/users';
import RolesPage from '../pages/backend/roles';
import HabilitationsPage from '../pages/backend/habilitations';

const Webroute = () => {
  return (
   <BrowserRouter>
    <Routes>
        <Route path={myroutes.homepage} name="login" element={<App />} />

        {/* Authentification */}
        <Route path={myroutes.login} name="login" element={<LoginPage />} />
        <Route path={myroutes.register} name="login" element={<RegisterPage />} />
        <Route path={myroutes.codeopt} name="codeopt" element={<CodeOtpPage />} />
        <Route path={myroutes.forgot_password} name="forgot_password" element={<ForgotPasswordPage />} />
        <Route path={myroutes.forgot_password_otp} name="forgot_password_otp" element={<ForgotPasswordCodeOtpPage />} />
        <Route path={myroutes.reset_password} name="reset_password" element={<ResetPasswordPage />} />
        {/* End Authentification */}

        {/* Administration */}
        <Route path={myroutes.dashboard} name="dashboard" element={<DashboardPage />} />
        <Route path={myroutes.index_users} name="index_users" element={<UsersPage />} />
        <Route path={myroutes.index_roles} name="index_roles" element={<RolesPage />} />
        <Route path={myroutes.index_habilitations} name="index_habilitations" element={<HabilitationsPage />} />
        {/* End Administration */}
    </Routes>
   </BrowserRouter>
  )
}
export default Webroute
