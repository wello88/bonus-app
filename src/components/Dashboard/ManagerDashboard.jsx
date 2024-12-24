import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import { verifyToken } from '../../utils/auth';
import { useAuth } from '../contexts/AuthContext';  // Import the context

const ManagerDashboard = () => {
  const { setToken } = useAuth();  // Use context to get setToken
  const [bonusRequests, setBonusRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenPayload = verifyToken(token);  // Pass token to verifyToken function

    if (!token || !tokenPayload || tokenPayload.role !== 'MANAGER') {
      localStorage.removeItem('token');
      setToken(null);
      navigate('/login');
      return;
    }

    const fetchBonusRequests = async () => {
      try {
        const response = await axios.get('/api/bonus-requests/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBonusRequests(response.data);
        setError(null);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          navigate('/login');
        } else {
          setError('Failed to fetch bonus requests');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBonusRequests();
  }, [navigate, setToken]);

  const handleCreateRequest = () => {
    navigate('/bonus-form');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading requests...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard manager">
      <div className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <div className="header-actions">
          <button 
            className="create-btn"
            onClick={handleCreateRequest}
          >
            Create New Request
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="requests-container">
        {bonusRequests.map((request) => (
          <div key={request.id} className="request-card">
            <h3>{request.title}</h3>
            <div className="request-details">
              <p>Amount: ${request.amount}</p>
              <p className={`status ${request.status.toLowerCase()}`}>
                Status: {request.status}
              </p>
              {request.reason && <p>Reason: {request.reason}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;
