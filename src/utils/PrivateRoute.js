import React from 'react';
import { Navigate } from 'react-router-dom';

export const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
};

const PrivateRoute = ({ element }) => {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return null;
    }
    return element;
};

export default PrivateRoute;
