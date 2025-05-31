import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"

const PublicRoute: React.FC = () => {
  const { token } = useAuth()

  return token ? <Navigate to="/movieList" replace /> : <Outlet />
}

export default PublicRoute