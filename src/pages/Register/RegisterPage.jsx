import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validationRules } from '../../utils/validators';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { User, Mail, Lock, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const { register: registerUser, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordVal = watch('password', '');

  // Calculate password strength score (0 to 3)
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(passwordVal);

  const onSubmit = (data) => {
    const { confirmPassword, ...payload } = data;
    registerUser(payload);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] text-white w-full space-y-5">
      <div className="space-y-1 text-left select-none">
        <p className="text-base font-semibold text-white/90 tracking-wide">SynkDocs</p>
        <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-300/40 text-xs font-semibold text-white backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-white">Full Name</label>
          <input
            type="text"
            placeholder="Sarah Jenkins"
            {...register('name', validationRules.fullName)}
            className="w-full px-3.5 py-2.5 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent shadow-xs"
          />
          {errors.name && (
            <p className="text-xs text-red-200 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-white">Email</label>
          <input
            type="email"
            placeholder="name@organization.com"
            {...register('email', validationRules.email)}
            className="w-full px-3.5 py-2.5 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent shadow-xs"
          />
          {errors.email && (
            <p className="text-xs text-red-200 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-white">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              {...register('password', validationRules.password)}
              className="w-full px-3.5 py-2.5 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent shadow-xs pr-10"
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

        {/* Password Strength Indicator */}
        {passwordVal && (
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-white/90">
              <span>Password Strength</span>
              <span className={`font-bold ${strength.score === 3 ? 'text-emerald-300' : strength.score === 2 ? 'text-amber-300' : 'text-red-300'}`}>
                {strength.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden flex gap-1">
              <div className={`h-full flex-1 transition-all ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
              <div className={`h-full flex-1 transition-all ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
              <div className={`h-full flex-1 transition-all ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-white">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === passwordVal || 'Passwords do not match',
              })}
              className="w-full px-3.5 py-2.5 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent shadow-xs pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-200 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#0a2540] hover:bg-[#071d33] active:scale-[0.99] text-white text-sm font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            'Register for free'
          )}
        </button>
      </form>

      <div className="text-center text-xs text-white/90 pt-1">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-bold text-white hover:underline cursor-pointer">
          Sign In
        </Link>
      </div>
    </div>
  );
};
