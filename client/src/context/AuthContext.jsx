import React, { createContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

const initialState = {
    token: localStorage.getItem('token'),
    // If a token exists, treat as logged in and load profile in background
    isAuthenticated: !!localStorage.getItem('token'),
    loading: true,
    user: null
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'REGISTER_SUCCESS':
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user || null,
                isAuthenticated: true,
                loading: false
            };
        case 'REGISTER_FAIL':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        case 'AUTH_ERROR':
            // Profile load failed. Don't delete token immediately (prevents "login loop")
            // User can still be treated as logged-in if a token exists, and retry later.
            return {
                ...state,
                loading: false,
                user: null,
                isAuthenticated: !!state.token
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const res = await api.get('/auth/profile');
                dispatch({
                    type: 'USER_LOADED',
                    payload: res.data
                });
            } catch (err) {
                dispatch({ type: 'AUTH_ERROR' });
            }
        } else {
            // No token: just mark as not authenticated (don't throw)
            dispatch({ type: 'AUTH_ERROR' });
        }
    };

    const register = async (formData) => {
        try {
            const res = await api.post('/auth/register', formData);
            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: res.data
            });
            loadUser();
        } catch (err) {
            dispatch({
                type: 'REGISTER_FAIL',
                payload: err.response.data.msg
            });
            throw err;
        }
    };

    const login = async (formData) => {
        try {
            const res = await api.post('/auth/login', formData);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data
            });
            // Don't force loadUser here; login response already contains user.
            // loadUser() will run on mount / refresh.
        } catch (err) {
            dispatch({
                type: 'LOGIN_FAIL',
                payload: err.response.data.msg
            });
            throw err;
        }
    };

    const logout = () => dispatch({ type: 'LOGOUT' });

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
