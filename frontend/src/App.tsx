import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Engineers from './pages/Engineers';
import Projects from './pages/Projects';
import Assignments from './pages/Assignments';
import Layout from './components/layout/Layout';
import { useAuthStore } from './store/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('engineer' | 'manager')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { token, user } = useAuthStore();
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Engineer Routes */}
        <Route
          path="/engineer/dashboard"
          element={
            <PrivateRoute allowedRoles={['engineer']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/engineer/assignments"
          element={
            <PrivateRoute allowedRoles={['engineer']}>
              <Assignments />
            </PrivateRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/engineers"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <Engineers />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/projects"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/assignments"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <Assignments />
            </PrivateRoute>
          }
        />

        {/* Redirect based on role */}
        <Route
          path="/"
          element={
            <Navigate to={user?.role === 'engineer' ? '/engineer/dashboard' : '/manager/dashboard'} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Navigate to={user?.role === 'engineer' ? '/engineer/dashboard' : '/manager/dashboard'} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
