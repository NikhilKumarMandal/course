import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function RequrieAuth({allowedRole}) {
    const {isLoggedIn,role} = useSelector((state) => state.auth)


  return isLoggedIn && allowedRole.find((myRole) => myRole === role) ? (
    <Outlet />
  ) : isLoggedIn ? (<Navigate to='/denied' />) : (<Navigate to='/login'/>)
}

export default RequrieAuth