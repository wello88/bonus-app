
// FinanceDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import { useAuth } from '../contexts/AuthContext';

const FinanceDashboard = () => {
  const [bonusRequests, setBonusRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, setToken } = useAuth();

  useEffect(() => {
    const fetchBonusRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching bonus requests with token:', token);
        
        const response = await axios.get('/api/bonus-requests/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Bonus requests response:', response.data);
        setBonusRequests(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching bonus requests:', error);
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

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/bonus-requests/${id}/approve/`, 
        { action },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setBonusRequests(prev =>
        prev.map(request =>
          request.id === id ? { ...request, status: action } : request
        )
      );
    } catch (err) {
      setError('Failed to update request');
    }
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
    <div className="dashboard finance">
      <div className="dashboard-header">
        <h1>Finance Dashboard - {user?.username}</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
            {request.status === "PENDING" && (
              <div className="actions">
                <button
                  className="approve-btn"
                  onClick={() => handleAction(request.id, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(request.id, "REJECTED")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceDashboard;