import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { client } from '../../Client'
import { Puff } from 'react-loader-spinner';
import './protected.css'
import { authHeaders } from '../../Utils'
const ProtectedRoute = ({ Component }) => {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    client.get('/user/checkAuth', authHeaders())
      .then(() => {
        setAuth(true);
      })
      .catch(() => {
        setAuth(false);
      })
  }, [])
  return (
    <div className="loader-container">
      {
        auth === null
          ?
          <div className="loader">
            <Puff color="#00BFFF" height={200} width={200} timeout={3000} />
          </div>
          :
          auth === true ? <Component /> : <Navigate to='/login' />
      }
    </div>
  )
}

export default ProtectedRoute