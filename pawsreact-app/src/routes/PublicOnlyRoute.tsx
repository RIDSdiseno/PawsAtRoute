import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = RouteProps & { component: React.ComponentType<any> };
export default function PublicOnlyRoute({ component: Cmp, ...rest }: Props) {
  const { isAuthenticated, user, loading } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) return <div style={{padding:16}}>Cargando…</div>;
        if (!isAuthenticated) return <Cmp {...props} />;
        const to = user?.rol === "PASEADOR" ? "/panel-paseador/inicio" : "/tabs/tab1";
        return <Redirect to={to} />;
      }}
    />
  );
}
