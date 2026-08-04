import { useSelector, useDispatch } from 'react-redux';
import { loginStart, registerStart, logoutStart, clearAuthError } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginStart(credentials));
  const register = (userData) => dispatch(registerStart(userData));
  const logout = () => dispatch(logoutStart());
  const clearError = () => dispatch(clearAuthError());

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
    clearError,
  };
};
