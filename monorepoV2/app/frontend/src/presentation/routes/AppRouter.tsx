import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/Login.page';
import { AdminDashboard } from '../pages/AdminDashboard.page';
import { UsersListPage } from '../pages/UsersList.page';
import { EmployeeDashboard } from '../pages/EmployeeDashboard.page';
import { ForgotPasswordPage } from '../pages/ForgotPassword.page';
import { AdminRoute } from '../components/AdminRoute.component';
import { EmployeeRoute } from '../components/EmployeeRoute.component';
import { ProtectedRoute } from '../components/ProtectedRoute.component';
import { AppWrapper } from '../components/AppWrapper.component';

export const AppRouter: React.FC = () => (
  <AppWrapper>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UsersListPage /></AdminRoute>} />
        <Route path="/employee/home" element={<EmployeeRoute><EmployeeDashboard /></EmployeeRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  </AppWrapper>
); 