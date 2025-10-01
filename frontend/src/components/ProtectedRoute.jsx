import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';
const ProtectedRoute=({children})=>{
  const {isAuthenticated,loading}=useAuth();
  if(loading){
    return(
      <div style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        height:"100vh",
        background:"linear-gradient(135deg, #667788, #887766)"
      }}>
        <Spin size='large'/>
      </div>
    );

  }
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>;
  }
  return children;

};
export default ProtectedRoute;
