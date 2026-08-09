import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validationRules } from '../../utils/validators';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

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
    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-docs-card border border-docs-border space-y-6">
      <div className="space-y-2 text-center sm:text-left select-none">
        <h2 className="text-2xl font-extrabold text-docs-darkText">Sign in to SynkDocs</h2>
        <p className="text-sm text-docs-subtext">Enter your email and password to access your workspace.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          icon={Mail}
          placeholder="name@organization.com"
          error={errors.email?.message}
          {...register('email', validationRules.email)}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="••••••••"
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

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-docs-subtext">
            <input type="checkbox" className="rounded border-gray-300 text-docs-blue focus:ring-docs-blue" />
            <span>Remember this device</span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          icon={LogIn}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-docs-subtext pt-2">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-bold text-docs-blue hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
};
