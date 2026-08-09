import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchProfileStart, updateProfileStart } from '../../redux/slices/profileSlice';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Loader } from '../../components/common/Loader';
import { User, Mail, Save, Image as ImageIcon } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
];

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const watchAvatarUrl = watch('avatarUrl');

  useEffect(() => {
    dispatch(fetchProfileStart());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        email: profile.email || '',
        avatarUrl: profile.avatarUrl || '',
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
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex items-center gap-4 pb-4 border-b border-docs-border">
        <Avatar src={watchAvatarUrl || profile?.avatarUrl} name={profile?.name || 'User'} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-docs-darkText">{profile?.name || 'User Profile'}</h1>
          <p className="text-xs text-docs-subtext">{profile?.email || 'user@synkdocs.io'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-docs-border p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture / Avatar Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-docs-subtext uppercase tracking-wider">
              Profile Picture / Avatar
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setValue('avatarUrl', url)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                    watchAvatarUrl === url ? 'border-docs-blue scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                  }`}
                >
                  <img src={url} alt="preset avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <Input
              label="Or Custom Avatar Image URL"
              icon={ImageIcon}
              placeholder="https://example.com/my-photo.jpg"
              {...register('avatarUrl')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              icon={User}
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
            <Input
              label="Email Address"
              icon={Mail}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
              error={errors.email?.message}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-docs-subtext uppercase tracking-wider">
              Bio
            </label>
            <textarea
              rows={3}
              placeholder="Tell collaborators a bit about yourself..."
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
