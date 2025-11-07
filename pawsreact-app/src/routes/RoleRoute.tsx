import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = RouteProps & { component: React.ComponentType<any>; allow: string[] };
export default function RoleRoute({ component: Cmp, allow, ...rest }: Props) {
  const { isAuthenticated, user } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) return <Redirect to="/login" />;
        if (!user) return <div style={{padding:16}}>Cargando…</div>;
        return allow.includes(user.rol) ? <Cmp {...props} /> : (
          <Redirect to={user.rol === "PASEADOR" ? "/panel-paseador/inicio" : "/tabs/tab1"} />
        );
      }}
    />
  );
}