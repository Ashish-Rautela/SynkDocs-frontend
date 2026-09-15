import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validationRules } from '../../utils/validators';
import { ROUTES } from '../../constants/routes';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] text-white w-full">
      {/* Brand Header */}
      <div className="mb-6">
        <p className="text-base font-semibold text-white/90 mb-1 tracking-wide">SynkDocs</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Login</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-300/40 text-xs font-semibold text-white backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            placeholder="username@gmail.com"
            {...register('email', validationRules.email)}
            className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent shadow-xs"
          />
          {errors.email && (
            <p className="text-xs text-red-200 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-white">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password', validationRules.password)}
              className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent shadow-xs pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-200 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="pt-0.5">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs text-white/80 hover:text-white hover:underline transition-colors cursor-pointer"
          >
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#0a2540] hover:bg-[#071d33] active:scale-[0.99] text-white text-sm font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Footer Registration Link */}
      <div className="text-center text-xs text-white/90 pt-6">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-bold text-white hover:underline cursor-pointer">
          Register for free
        </Link>
      </div>
    </div>
  );
};
