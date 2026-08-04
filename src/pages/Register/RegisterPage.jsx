import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validationRules } from '../../utils/validators';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

export const RegisterPage = () => {
  const { register: registerUser, loading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-docs-card border border-docs-border space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl font-extrabold text-docs-darkText">Get Started with SynkDocs</h2>
        <p className="text-sm text-docs-subtext">Create your collaborative account to start editing.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600">
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

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password', validationRules.password)}
        />

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
