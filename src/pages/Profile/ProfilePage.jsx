import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchProfileStart, updateProfileStart } from '../../redux/slices/profileSlice';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Loader } from '../../components/common/Loader';
import { User, Mail, Briefcase, Save, Shield } from 'lucide-react';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchProfileStart());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = (data) => {
    dispatch(updateProfileStart(data));
  };

  if (loading && !profile) {
    return <Loader text="Loading user profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-docs-border">
        <Avatar src={profile?.avatarUrl} name={profile?.name || 'User'} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-docs-darkText">{profile?.name || 'User Profile'}</h1>
          <p className="text-xs text-docs-subtext">{profile?.email || 'user@synkdocs.io'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-docs-border p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              icon={User}
              {...register('name')}
            />
            <Input
              label="Email Address"
              icon={Mail}
              disabled
              {...register('email')}
              helperText="Email address cannot be changed directly."
            />
          </div>

          <Input
            label="Job Title / Role"
            icon={Briefcase}
            {...register('role')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-docs-subtext uppercase tracking-wider">
              Bio
            </label>
            <textarea
              rows={3}
              {...register('bio')}
              className="w-full px-3.5 py-2.5 bg-white border border-docs-border rounded-xl text-sm text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue"
            />
          </div>

          <div className="pt-4 border-t border-docs-border flex justify-end">
            <Button type="submit" variant="primary" isLoading={loading} icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
