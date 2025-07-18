import { getSession } from '../utils/supabaseAuth';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const sess = await getSession();
      setSession(sess);
      setLoading(false);
    }
    checkSession();
  }, []);

  if (loading) return null;
  if (!session) return <Navigate to="/register" replace />;
  return children;
};

export default UserProtectedRoute; 