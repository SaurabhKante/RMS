import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (role !== "ADMIN") {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default AdminRoute;