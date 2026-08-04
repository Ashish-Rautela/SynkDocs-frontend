import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePreferences } from '../../redux/slices/profileSlice';
import { addToast } from '../../redux/slices/notificationSlice';
import { Settings, Moon, Sun, Bell, Save, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const SettingsPage = () => {
  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.profile.preferences);

  const handleToggle = (key) => {
    const updated = { [key]: !preferences[key] };
    dispatch(updatePreferences(updated));
    dispatch(addToast({ type: 'success', message: 'Preference updated successfully' }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-docs-border">
        <div className="p-3 rounded-2xl bg-blue-50 text-docs-blue">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-docs-darkText">Workspace Preferences</h1>
          <p className="text-xs text-docs-subtext">Manage document editor defaults, theme, and notification settings.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-docs-border p-8 shadow-sm space-y-6">
        {/* Editor Defaults */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-docs-darkText border-b border-docs-border pb-2">
            Editor Engine Defaults
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-docs-darkText">Auto-Save Interval</p>
              <p className="text-xs text-docs-subtext">Automatically trigger background saga save after typing pauses.</p>
            </div>
            <select className="px-3 py-1.5 bg-docs-bg border border-docs-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-docs-blue">
              <option value="1500">1.5 seconds (Fast)</option>
              <option value="3000">3.0 seconds (Standard)</option>
              <option value="5000">5.0 seconds (Relaxed)</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4 pt-4 border-t border-docs-border">
          <h3 className="text-sm font-bold text-docs-darkText border-b border-docs-border pb-2">
            Collaboration & Notifications
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-docs-darkText">Email Notifications</p>
              <p className="text-xs text-docs-subtext">Receive emails when invited to a document or tagged in comments.</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
              className="w-5 h-5 rounded border-gray-300 text-docs-blue focus:ring-docs-blue cursor-pointer"
            />
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4 pt-4 border-t border-docs-border">
          <h3 className="text-sm font-bold text-docs-darkText border-b border-docs-border pb-2">
            Security & Sessions
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-docs-darkText">Active JWT Sessions</p>
              <p className="text-xs text-docs-subtext">Tokens automatically refresh on expiry with secure response interceptors.</p>
            </div>
            <Button variant="outline" size="sm" icon={ShieldCheck}>
              Revoke Other Sessions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
