import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const AdminRoute = () => {
    const { isAuthenticated, loading, user } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return isAuthenticated && user && user.isAdmin ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    );
};

export default AdminRoute;
