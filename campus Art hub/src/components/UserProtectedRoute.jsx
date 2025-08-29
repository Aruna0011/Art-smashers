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
        // Primary check: localStorage current user
        const localUser = localStorage.getItem('art_hub_current_user');
        if (localUser) {
          const user = JSON.parse(localUser);
          setSession({ user });
        } else {
          // Fallback: try getSession
          const sess = await getSession();
          setSession(sess);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setSession(null);
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