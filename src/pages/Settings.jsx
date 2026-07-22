// src/pages/Settings.jsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  PencilIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftOnRectangleIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  MoonIcon,
  SunIcon,
  WifiIcon,
  LanguageIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Helper to format Naira
const formatNaira = (amount) => {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ----------------------------
  // STATE
  // ----------------------------

  // Profile
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || 'Professional service provider',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Account
  const [accountData, setAccountData] = useState({
    email: user?.email || '',
    phone: user?.phone || '+234 800 000 0000',
  });
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  // Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    bookingUpdates: true,
    marketingEmails: false,
    paymentAlerts: true,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // 'public', 'private', 'providers-only'
    showEmail: false,
    showPhone: false,
    dataSharing: false,
  });

  // Payment / Wallet
  const [paymentSettings, setPaymentSettings] = useState({
    defaultCurrency: 'NGN',
    walletAutoTopup: false,
    autoTopupAmount: 10000,
    paymentMethods: [
      { id: 'pm1', type: 'Bank Transfer', last4: '1234', isDefault: true },
      { id: 'pm2', type: 'Card', last4: '5678', isDefault: false },
      { id: 'pm3', type: 'Mobile Money', last4: '9101', isDefault: false },
    ],
  });

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: 'light', // 'light' | 'dark' | 'system'
    language: 'en',
  });

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  // ----------------------------
  // HANDLERS
  // ----------------------------

  // Profile
  const handleProfileSave = () => {
    updateUser(profileData);
    setIsEditingProfile(false);
    toast.success('Profile updated successfully');
  };

  // Account
  const handleAccountSave = () => {
    // In a real app, you'd call an API to update email/phone
    toast.success('Account details updated');
    setIsEditingAccount(false);
  };

  // Password
  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    // In a real app, call API to change password
    toast.success('Password changed successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Notifications toggle
  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${!notifications[key] ? 'enabled' : 'disabled'}`);
  };

  // Privacy
  const updatePrivacy = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success('Privacy settings updated');
  };

  // Payment
  const setDefaultPayment = (id) => {
    setPaymentSettings(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    }));
    toast.success('Default payment method updated');
  };

  const toggleAutoTopup = () => {
    setPaymentSettings(prev => ({
      ...prev,
      walletAutoTopup: !prev.walletAutoTopup,
    }));
    toast.success(`Auto top-up ${!paymentSettings.walletAutoTopup ? 'enabled' : 'disabled'}`);
  };

  // Appearance
  const updateTheme = (theme) => {
    setAppearance(prev => ({ ...prev, theme }));
    // In a real app, apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast.success(`Theme set to ${theme}`);
  };

  // Danger zone - Logout
  const handleLogout = () => {
    setModalMessage('Are you sure you want to log out?');
    setModalAction('logout');
    setShowConfirmModal(true);
  };

  const handleDeleteAccount = () => {
    setModalMessage('⚠️ This action is permanent. All your data will be deleted and cannot be recovered. Are you sure you want to delete your account?');
    setModalAction('delete');
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (modalAction === 'logout') {
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } else if (modalAction === 'delete') {
      // In a real app, call API to delete account
      toast.success('Account deleted. We\'re sorry to see you go.');
      logout();
      navigate('/');
    }
    setShowConfirmModal(false);
    setModalAction(null);
  };

  // ----------------------------
  // RENDER HELPERS
  // ----------------------------

  const SectionWrapper = ({ children, title, description, icon: Icon }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );

  const SettingRow = ({ label, description, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <label className="font-medium text-gray-800">{label}</label>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  // ----------------------------
  // MAIN RENDER
  // ----------------------------

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your account preferences</p>
          </div>
          <Link
            to="/dashboard"
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-8">
          {/* -------------------- PROFILE SECTION -------------------- */}
          <SectionWrapper title="Profile" icon={UserCircleIcon} description="Manage your public profile information">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden shadow-md">
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition shadow-lg"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    // In a real app, upload to server
                    toast.success('Photo uploaded successfully');
                  }}
                />
              </div>

              {/* Profile fields */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        isEditingProfile ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        isEditingProfile ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <input
                    type="text"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditingProfile}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      isEditingProfile ? 'border-gray-300' : 'border-transparent bg-gray-50'
                    }`}
                  />
                </div>
                <div className="flex gap-2">
                  {isEditingProfile ? (
                    <>
                      <button
                        onClick={handleProfileSave}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* -------------------- ACCOUNT SECTION -------------------- */}
          <SectionWrapper title="Account" icon={Cog6ToothIcon} description="Manage your login credentials">
            <SettingRow label="Email Address" description="Your primary email for all communications">
              {isEditingAccount ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData(prev => ({ ...prev, email: e.target.value }))}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button onClick={handleAccountSave} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Save</button>
                  <button onClick={() => setIsEditingAccount(false)} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-gray-700">{accountData.email}</span>
                  <button onClick={() => setIsEditingAccount(true)} className="text-blue-600 hover:text-blue-700">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </SettingRow>

            <SettingRow label="Phone Number" description="Used for SMS notifications and verification">
              <span className="text-gray-700">{accountData.phone}</span>
            </SettingRow>

            <SettingRow label="Role" description="Your account type">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium capitalize">{user?.role || 'client'}</span>
            </SettingRow>

            {/* Change Password */}
            <div className="pt-2 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Change Password</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="text-gray-500 hover:text-gray-700">
                    {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} className="text-gray-500 hover:text-gray-700">
                    {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Update Password
                </button>
              </div>
            </div>
          </SectionWrapper>

          {/* -------------------- NOTIFICATIONS SECTION -------------------- */}
          <SectionWrapper title="Notifications" icon={BellIcon} description="Control how you receive alerts">
            <SettingRow label="Email Notifications" description="Receive booking updates via email">
              <ToggleSwitch enabled={notifications.emailNotifications} onChange={() => toggleNotification('emailNotifications')} />
            </SettingRow>
            <SettingRow label="Push Notifications" description="Receive real-time alerts on your device">
              <ToggleSwitch enabled={notifications.pushNotifications} onChange={() => toggleNotification('pushNotifications')} />
            </SettingRow>
            <SettingRow label="SMS Notifications" description="Receive important alerts via SMS">
              <ToggleSwitch enabled={notifications.smsNotifications} onChange={() => toggleNotification('smsNotifications')} />
            </SettingRow>
            <SettingRow label="Booking Updates" description="Get notified about booking status changes">
              <ToggleSwitch enabled={notifications.bookingUpdates} onChange={() => toggleNotification('bookingUpdates')} />
            </SettingRow>
            <SettingRow label="Payment Alerts" description="Notifications for payments and transactions">
              <ToggleSwitch enabled={notifications.paymentAlerts} onChange={() => toggleNotification('paymentAlerts')} />
            </SettingRow>
            <SettingRow label="Marketing Emails" description="Promotions, tips, and newsletters">
              <ToggleSwitch enabled={notifications.marketingEmails} onChange={() => toggleNotification('marketingEmails')} />
            </SettingRow>
          </SectionWrapper>

          {/* -------------------- PRIVACY SECTION -------------------- */}
          <SectionWrapper title="Privacy & Security" icon={ShieldCheckIcon} description="Control your privacy and data preferences">
            <SettingRow label="Profile Visibility" description="Who can see your profile?">
              <div className="flex gap-2">
                {['public', 'private', 'providers-only'].map((option) => (
                  <button
                    key={option}
                    onClick={() => updatePrivacy('profileVisibility', option)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                      privacy.profileVisibility === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option === 'providers-only' ? 'Providers Only' : option}
                  </button>
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Show Email" description="Display your email on your public profile">
              <ToggleSwitch enabled={privacy.showEmail} onChange={() => updatePrivacy('showEmail', !privacy.showEmail)} />
            </SettingRow>
            <SettingRow label="Show Phone" description="Display your phone number on your public profile">
              <ToggleSwitch enabled={privacy.showPhone} onChange={() => updatePrivacy('showPhone', !privacy.showPhone)} />
            </SettingRow>
            <SettingRow label="Data Sharing" description="Allow anonymized data to improve platform services">
              <ToggleSwitch enabled={privacy.dataSharing} onChange={() => updatePrivacy('dataSharing', !privacy.dataSharing)} />
            </SettingRow>
          </SectionWrapper>

          {/* -------------------- PAYMENT SECTION -------------------- */}
          <SectionWrapper title="Payment & Wallet" icon={CreditCardIcon} description="Manage your payment preferences and wallet">
            <SettingRow label="Default Currency" description="Your preferred currency for transactions">
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentSettings(prev => ({ ...prev, defaultCurrency: 'NGN' }))}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    paymentSettings.defaultCurrency === 'NGN' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ₦ NGN
                </button>
                <button
                  onClick={() => setPaymentSettings(prev => ({ ...prev, defaultCurrency: 'USD' }))}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    paymentSettings.defaultCurrency === 'USD' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </SettingRow>

            <SettingRow label="Auto Top-up" description={`Automatically top up wallet when balance falls below ${formatNaira(5000)}`}>
              <div className="flex items-center gap-4">
                <ToggleSwitch enabled={paymentSettings.walletAutoTopup} onChange={toggleAutoTopup} />
                {paymentSettings.walletAutoTopup && (
                  <input
                    type="number"
                    value={paymentSettings.autoTopupAmount}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, autoTopupAmount: Number(e.target.value) }))}
                    className="w-28 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                )}
              </div>
            </SettingRow>

            <div className="pt-2 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Payment Methods</h4>
              <div className="space-y-2">
                {paymentSettings.paymentMethods.map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="capitalize text-sm font-medium">{pm.type}</span>
                      <span className="text-sm text-gray-500">•••• {pm.last4}</span>
                      {pm.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    {!pm.isDefault && (
                      <button
                        onClick={() => setDefaultPayment(pm.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                + Add payment method
              </button>
            </div>
          </SectionWrapper>

          {/* -------------------- APPEARANCE SECTION -------------------- */}
          <SectionWrapper title="Appearance" icon={PaintBrushIcon} description="Customize your app experience">
            <SettingRow label="Theme" description="Choose between light, dark, or system default">
              <div className="flex gap-2">
                {[
                  { value: 'light', icon: SunIcon, label: 'Light' },
                  { value: 'dark', icon: MoonIcon, label: 'Dark' },
                  { value: 'system', icon: WifiIcon, label: 'System' },
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => updateTheme(theme.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                      appearance.theme === theme.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <theme.icon className="w-4 h-4" />
                    {theme.label}
                  </button>
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Language" description="Select your preferred language">
              <div className="flex gap-2">
                {[
                  { value: 'en', label: 'English' },
                  { value: 'ha', label: 'Hausa' },
                  { value: 'yo', label: 'Yoruba' },
                  { value: 'ig', label: 'Igbo' },
                ].map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setAppearance(prev => ({ ...prev, language: lang.value }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      appearance.language === lang.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </SectionWrapper>

          {/* -------------------- DANGER ZONE -------------------- */}
          <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold text-red-700">Danger Zone</h3>
            </div>
            <p className="text-sm text-red-600">These actions are irreversible. Please proceed with caution.</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                Log Out
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-5 py-2 border-2 border-red-400 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- CONFIRMATION MODAL -------------------- */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">Confirm Action</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6 whitespace-pre-wrap">{modalMessage}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-lg font-medium text-white transition ${
                    modalAction === 'logout'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;