import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = RouteProps & { component: React.ComponentType<any> };
export default function ProtectedRoute({ component: Cmp, ...rest }: Props) {
  const { isAuthenticated, loading } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) return <div style={{padding:16}}>Cargando…</div>;
        return isAuthenticated ? <Cmp {...props} /> : <Redirect to="/login" />;
      }}
    />
  );
}