import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Shield, 
  Bell, 
  Save, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export const ProfileView: React.FC = () => {
  const { profile: globalProfile, updateProfile, showToast } = useBusiness();

  // Local profile states
  const [profile, setProfile] = useState({
    name: globalProfile.name,
    email: globalProfile.email,
    phone: globalProfile.phone || '',
    role: globalProfile.role,
    avatar: globalProfile.avatar || ''
  });

  const [password, setPassword] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [notifs, setNotifs] = useState({
    invoiceSettlements: true,
    dailyDigest: true,
    assistantInsights: false
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      avatar: profile.avatar
    });
    setSaveSuccess(true);
    showToast('Your profile settings have been successfully synchronized!', 'success');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPass !== password.confirm) {
      setPassError('New passwords do not match');
      return;
    }
    setPassError('');
    setPassSuccess(true);
    setPassword({ current: '', newPass: '', confirm: '' });
    showToast('Credentials updated successfully.', 'success');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs max-w-4xl mx-auto">
      
      {/* 1. MODULE CONTROL BAR */}
      <div className="border-b border-gray-100 pb-4 dark:border-zinc-800">
        <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50 font-sans">User Profile Ledger</h1>
        <p className="text-2xs text-gray-400 dark:text-zinc-500">Configure credentials, operational identities, and gateway notifications</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column Profile identity card */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-2xs text-center dark:border-zinc-800 dark:bg-zinc-900">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt="Profile Avatar" 
                className="h-20 w-20 rounded-2xl object-cover border border-gray-100 dark:border-zinc-800 mx-auto shadow-2xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 flex items-center justify-center font-bold text-2xl mx-auto shadow-2xs">
                {profile.name ? profile.name.charAt(0) : 'S'}
              </div>
            )}
            
            <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-50 mt-4">{profile.name}</h3>
            <p className="text-3xs text-gray-400 dark:text-zinc-500 font-semibold uppercase tracking-wider mt-1">{profile.role}</p>
            <p className="text-3xs text-gray-400 mt-2 font-mono dark:text-zinc-500">{profile.email}</p>

            <div className="mt-6 pt-6 border-t border-gray-50 dark:border-zinc-800 flex justify-center gap-1.5 text-4xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50/20 p-2.5 rounded-lg">
              <Shield className="h-3.5 w-3.5" />
              <span>Identity Verified</span>
            </div>
          </div>
        </div>

        {/* Right Columns Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Card 1: Account details form */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-50 border-b border-gray-50 pb-3 dark:border-zinc-800 flex items-center gap-1.5">
              <User className="h-4 w-4 text-teal-500" />
              <span>Identity Specifications</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Full Identity Name</label>
                  <input
                    id="profile-name-input"
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Identity Role Title</label>
                  <input
                    id="profile-role-input"
                    type="text"
                    required
                    value={profile.role}
                    onChange={(e) => setProfile({...profile, role: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Email Account Address</label>
                  <input
                    id="profile-email-input"
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Phone Connection</label>
                  <input
                    id="profile-phone-input"
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Profile Avatar Image URL</label>
                <input
                  id="profile-avatar-input"
                  type="text"
                  value={profile.avatar}
                  onChange={(e) => setProfile({...profile, avatar: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-800">
                {saveSuccess ? (
                  <span className="text-3xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Identity verified & updated successfully</span>
                  </span>
                ) : <span />}

                <button
                  id="profile-save-submit"
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500 font-semibold shadow-3xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Password modifier */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-50 border-b border-gray-50 pb-3 dark:border-zinc-800 flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-teal-500" />
              <span>Credential Modification</span>
            </h3>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Current Password Token</label>
                <input
                  id="profile-pass-current"
                  type="password"
                  placeholder="••••••••"
                  value={password.current}
                  onChange={(e) => setPassword({...password, current: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">New Password Token</label>
                  <input
                    id="profile-pass-new"
                    type="password"
                    placeholder="••••••••"
                    value={password.newPass}
                    onChange={(e) => setPassword({...password, newPass: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Verify Password Token</label>
                  <input
                    id="profile-pass-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={password.confirm}
                    onChange={(e) => setPassword({...password, confirm: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>
              </div>

              {passError && (
                <p className="text-3xs font-bold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{passError}</span>
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-800">
                {passSuccess ? (
                  <span className="text-3xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Credentials updated successfully</span>
                  </span>
                ) : <span />}

                <button
                  id="profile-pass-submit"
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-gray-950 px-4 py-2 text-white hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 3: Notifications toggle settings */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-50 border-b border-gray-50 pb-3 dark:border-zinc-800 flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-teal-500" />
              <span>Gateway Notification Rules</span>
            </h3>

            <div className="mt-4 space-y-4">
              
              <div className="flex items-center justify-between p-1">
                <div>
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Invoice Settlements Alerts</span>
                  <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-0.5">Receive instantaneous webhook triggers on successful payments</p>
                </div>
                <input
                  id="profile-notif-settle"
                  type="checkbox"
                  checked={notifs.invoiceSettlements}
                  onChange={(e) => setNotifs({...notifs, invoiceSettlements: e.target.checked})}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 rounded-sm"
                />
              </div>

              <div className="flex items-center justify-between p-1">
                <div>
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Daily Digest Web Summary</span>
                  <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-0.5">Automate visual analytics charts summaries once a day</p>
                </div>
                <input
                  id="profile-notif-digest"
                  type="checkbox"
                  checked={notifs.dailyDigest}
                  onChange={(e) => setNotifs({...notifs, dailyDigest: e.target.checked})}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 rounded-sm"
                />
              </div>

              <div className="flex items-center justify-between p-1">
                <div>
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Assistant Intelligence Prompts</span>
                  <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-0.5">Permit Gemini AI to suggest proactive deliverables improvements</p>
                </div>
                <input
                  id="profile-notif-insights"
                  type="checkbox"
                  checked={notifs.assistantInsights}
                  onChange={(e) => setNotifs({...notifs, assistantInsights: e.target.checked})}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 rounded-sm"
                />
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default ProfileView;
