import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

export default function RequireAuth({ children }:{children: any}) {

    const auth = useAuth();

    if(!auth.user){
        return <Navigate to='/' />
    }

  return children;
}
