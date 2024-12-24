// App.jsx - Update the routes
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './components/contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Dashboard from "./components/Dashboard";
import BonusForm from "./components/BonusForm";
import Login from "./components/Login";
import "./styles/App.scss";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bonus-form"  // Changed from /bonus to /bonus-form
            element={
              <ProtectedRoute roles={['MANAGER']}>
                <BonusForm />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;