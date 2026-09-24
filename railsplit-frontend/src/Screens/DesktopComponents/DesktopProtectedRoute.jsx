import React from "react";
import { Navigate } from "react-router-dom";

function DesktopProtectedRoute({ children, loggedIn }) {
    if (!loggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default DesktopProtectedRoute;
