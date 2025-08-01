import { getSession } from '../utils/supabaseAuth';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const UserProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const sess = await getSession();
        setSession(sess);
      } catch (error) {
        console.error('Session check error:', error);
        // Fallback to local storage check
        const localUser = JSON.parse(localStorage.getItem('art_hub_current_user'));
        setSession(localUser ? { user: localUser } : null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default UserProtectedRoute; 