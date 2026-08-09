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
    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-docs-card border border-docs-border space-y-6">
      <div className="space-y-2 text-center sm:text-left select-none">
        <h2 className="text-2xl font-extrabold text-docs-darkText">Get Started with SynkDocs</h2>
        <p className="text-sm text-docs-subtext">Create your collaborative account to start editing.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          icon={User}
          placeholder="Sarah Jenkins"
          error={errors.name?.message}
          {...register('name', validationRules.fullName)}
        />

        <Input
          label="Work Email Address"
          icon={Mail}
          placeholder="sarah.j@synkdocs.io"
          error={errors.email?.message}
          {...register('email', validationRules.email)}
        />

        {/* Password input with toggle */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register('password', validationRules.password)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-docs-subtext hover:text-docs-darkText transition-colors p-1"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password strength meter indicator */}
        {passwordVal && (
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-docs-subtext">
              <span>Password Strength</span>
              <span className={`font-bold ${strength.score === 3 ? 'text-emerald-600' : strength.score === 2 ? 'text-amber-600' : 'text-red-600'}`}>
                {strength.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
              <div className={`h-full flex-1 transition-all ${strength.score >= 1 ? strength.color : 'bg-gray-200'}`} />
              <div className={`h-full flex-1 transition-all ${strength.score >= 2 ? strength.color : 'bg-gray-200'}`} />
              <div className={`h-full flex-1 transition-all ${strength.score >= 3 ? strength.color : 'bg-gray-200'}`} />
            </div>
          </div>
        )}

        {/* Confirm Password input */}
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            icon={ShieldCheck}
            placeholder="Re-enter password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === passwordVal || 'Passwords do not match',
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-docs-subtext hover:text-docs-darkText transition-colors p-1"
            title={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          icon={UserPlus}
          className="w-full mt-2"
        >
          Create Free Account
        </Button>
      </form>

      <div className="text-center text-xs text-docs-subtext pt-2">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-bold text-docs-blue hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
