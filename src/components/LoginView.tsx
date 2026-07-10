import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Mail, 
  Lock, 
  Shield, 
  ArrowRight, 
  Loader2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  User, 
  Briefcase, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { signInWithEmail, signInWithGoogle, signUpWithEmail, showToast, settings, resetPassword } = useBusiness();
  
  // Auth view mode: 'signin' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Loader States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthNotAllowedError, setIsAuthNotAllowedError] = useState(false);
  const [isInvalidCredentialError, setIsInvalidCredentialError] = useState(false);
  const [isUnauthorizedDomainError, setIsUnauthorizedDomainError] = useState(false);

  // Forgot Password inputs & status
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('sjenkins@veloracrm.ai');
  const [signInPassword, setSignInPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up inputs
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpBusinessName, setSignUpBusinessName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // Show/Hide password states
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-gray-200 dark:bg-zinc-800', textColor: 'text-gray-400' };
    let score = 0;
    
    // Criteria checks
    const hasMinLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    switch (score) {
      case 1:
        return { score, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-500' };
      case 2:
        return { score, label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500' };
      case 3:
        return { score, label: 'Good', color: 'bg-teal-500', textColor: 'text-teal-600 dark:text-teal-400' };
      case 4:
        return { score, label: 'Excellent', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
      default:
        return { score: 0, label: 'Very Weak', color: 'bg-rose-600', textColor: 'text-rose-600' };
    }
  };

  const strength = getPasswordStrength(signUpPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthNotAllowedError(false);
    setIsInvalidCredentialError(false);
    setIsUnauthorizedDomainError(false);

    if (!signInEmail || !signInPassword) {
      setError('Please fill in all security fields.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(signInEmail, signInPassword);
      showToast('Successfully authenticated. Welcome back!', 'success');
    } catch (err: any) {
      console.error(err);
      
      // Auto-register default demo account for frictionless onboarding if database is new
      if (
        signInEmail === 'sjenkins@veloracrm.ai' &&
        signInPassword === 'password' &&
        (err.code === 'auth/invalid-credential' || 
         err.code === 'auth/user-not-found' || 
         err.message?.includes('invalid-credential') ||
         err.message?.includes('user-not-found'))
      ) {
        try {
          await signUpWithEmail('sjenkins@veloracrm.ai', 'password', 'Samantha', 'Jenkins');
          showToast('Welcome to your new CRM workspace! Default operator account created successfully.', 'success');
          setIsLoading(false);
          return;
        } catch (signUpErr: any) {
          console.error('Failed to auto-register default account:', signUpErr);
        }
      }

      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        setIsAuthNotAllowedError(true);
        setError('Email/Password provider is not enabled in your Firebase Console.');
      } else if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password' ||
        err.message?.includes('invalid-credential') ||
        err.message?.includes('user-not-found')
      ) {
        setIsInvalidCredentialError(true);
        setError('Invalid credentials or operator account does not exist in this Firebase workspace database.');
      } else {
        setError(err.message || 'Failed to authenticate. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setSignInEmail('sjenkins@veloracrm.ai');
    setSignInPassword('password');
    showToast('Demo credentials pre-filled!', 'info');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotSuccess(false);
    setIsAuthNotAllowedError(false);
    setIsInvalidCredentialError(false);
    setIsUnauthorizedDomainError(false);

    const emailTrimmed = forgotEmail.trim();
    if (!emailTrimmed) {
      setError('Please provide your operator email address.');
      return;
    }

    if (!validateEmail(emailTrimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(emailTrimmed);
      setForgotSuccess(true);
      showToast('Password reset email sent! Check your inbox for security instructions.', 'success');
    } catch (err: any) {
      console.error('Password reset failure:', err);
      if (err.code === 'auth/user-not-found' || err.message?.includes('user-not-found')) {
        setError('No operator profile matches this email address. Please check spelling or register.');
      } else if (err.code === 'auth/invalid-email' || err.message?.includes('invalid-email')) {
        setError('The email address structure is invalid in Firebase authentication.');
      } else if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        setIsAuthNotAllowedError(true);
        setError('Password reset operations are not enabled/allowed on this project.');
      } else {
        setError(err.message || 'Failed to send security password reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Regular expression for validating Email format
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthNotAllowedError(false);
    setIsInvalidCredentialError(false);
    setIsUnauthorizedDomainError(false);

    // Validations
    if (!signUpFirstName.trim()) {
      setError('First name is required.');
      return;
    }
    if (!signUpLastName.trim()) {
      setError('Last name is required.');
      return;
    }
    if (!signUpEmail.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!validateEmail(signUpEmail)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!signUpPassword) {
      setError('Password is required.');
      return;
    }
    if (signUpPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the Terms & Conditions.');
      return;
    }
    if (!acceptPrivacy) {
      setError('You must accept the Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(signUpEmail, signUpPassword, signUpFirstName, signUpLastName);
      showToast('Registration successful! Welcome to your Workspace.', 'success');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        setIsAuthNotAllowedError(true);
        setError('Email/Password provider is not enabled in your Firebase Console.');
      } else {
        setError(err.message || 'Failed to create operator profile.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);
    setIsUnauthorizedDomainError(false);
    showToast('Connecting with Google Secure Identity...', 'info');
    try {
      await signInWithGoogle();
      showToast('Successfully authenticated with Google!', 'success');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain') || err.message?.includes('unauthorized domain')) {
        setIsUnauthorizedDomainError(true);
        setError('This domain is not authorized for Google Sign-In in your Firebase Console.');
      } else {
        setError(err.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        
        {/* Logo and Brand Title Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2.5 bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-100/50 dark:border-teal-900/30 shadow-xs mb-4">
            <img 
              src={settings.logo} 
              alt="Business Logo" 
              className="h-10 w-10 rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50 font-sans">
            {settings.businessName}
          </h1>
          <p className="text-3xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1 font-mono">
            Enterprise Command Suite
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/80 backdrop-blur-md transition-all">
          
          {isAuthNotAllowedError && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/50 text-amber-900 text-3xs dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300 space-y-2 leading-relaxed mb-4">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-sans text-amber-800 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Firebase Auth Configuration Required</span>
              </div>
              <p>
                The <strong>Email/Password</strong> provider is not enabled in this Firebase project. To use email authentication, please:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-1 font-sans font-medium text-amber-850 dark:text-amber-200">
                <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-700 font-bold">Firebase Console</a></li>
                <li>Navigate to <strong>Build</strong> &gt; <strong>Authentication</strong> &gt; <strong>Sign-in method</strong></li>
                <li>Click <strong>Add new provider</strong>, choose <strong>Email/Password</strong>, and enable it</li>
              </ol>
              <p className="text-4xs font-mono font-semibold pt-1">
                💡 Quick Fix: Use the <strong>Continue with Google</strong> option below to authenticate instantly!
              </p>
            </div>
          )}

          {isUnauthorizedDomainError && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/50 text-amber-900 text-3xs dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300 space-y-2 leading-relaxed mb-4">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-sans text-amber-800 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Firebase Unauthorized Domain</span>
              </div>
              <p>
                The domain <strong className="break-all">{window.location.hostname}</strong> is not authorized for OAuth operations in your Firebase project. To enable Google Sign-In, please:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-1 font-sans font-medium text-amber-850 dark:text-amber-200">
                <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-700 font-bold">Firebase Console</a></li>
                <li>Navigate to <strong>Build</strong> &gt; <strong>Authentication</strong> &gt; <strong>Settings</strong> tab</li>
                <li>Under <strong>Authorized domains</strong>, click <strong>Add domain</strong></li>
                <li>Add this precise domain: <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded font-mono font-bold break-all select-all text-amber-950 dark:text-amber-100">{window.location.hostname}</code></li>
              </ol>
              <p className="text-4xs font-mono font-semibold pt-1">
                💡 Quick Fix: Use the standard <strong>Email/Password</strong> fields above to sign in or register instantly!
              </p>
            </div>
          )}

          {isInvalidCredentialError && (
            <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/50 text-amber-900 text-3xs dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300 space-y-2 leading-relaxed mb-4">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-sans text-amber-850 dark:text-amber-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span>New Database Account Needed</span>
              </div>
              <p>
                Since your custom Firebase database `<strong>{settings.businessName || 'velora-crm-ai'}</strong>` is newly configured, the pre-filled demo credentials do not exist yet. Please register your account or use Google to authenticate instantly:
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setIsInvalidCredentialError(false);
                    setAuthMode('signup');
                  }}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-4xs uppercase tracking-wider font-sans transition-colors cursor-pointer"
                >
                  Create Account (Sign Up)
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-bold text-4xs uppercase tracking-wider font-sans transition-colors cursor-pointer dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
                >
                  Sign In with Google
                </button>
              </div>
            </div>
          )}

          {/* SIGN IN VIEW */}
          {authMode === 'signin' && (
            <>
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3 mb-5 dark:border-zinc-850">
                <Shield className="h-4 w-4 text-teal-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 font-sans">
                  Gateway Identity Check
                </span>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-3xs font-semibold dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/20">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1.5 font-mono">
                    Operator Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="sjenkins@veloracrm.ai"
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-150 pl-9 p-2.5 text-xs text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 font-mono">
                      Secure Passkey
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setForgotSuccess(false);
                        setIsAuthNotAllowedError(false);
                        setIsInvalidCredentialError(false);
                        setForgotEmail(signInEmail);
                        setAuthMode('forgot');
                      }}
                      className="text-4xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer font-mono border-none bg-transparent outline-hidden p-0"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <Lock className="h-3.5 w-3.5" />
                    </span>
                    <input
                      id="login-password-input"
                      type={showSignInPassword ? "text" : "password"}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-150 pl-9 pr-10 p-2.5 text-xs text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    >
                      {showSignInPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-4xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider font-mono">
                    <input
                      id="login-remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      className="rounded-xs border-gray-250 text-teal-600 focus:ring-teal-500 h-3.5 w-3.5 dark:border-zinc-800 dark:bg-zinc-900"
                    />
                    <span>Persistent Session</span>
                  </label>
                </div>

                <button
                  id="login-submit-button"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white p-2.5 font-bold text-xs shadow-xs transition-all disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Unlock Workspace</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* OR Divider with visual alignment */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-100 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-4xs uppercase tracking-wider font-extrabold">
                  <span className="bg-white px-2.5 text-gray-400 dark:bg-zinc-900 dark:text-zinc-500 font-mono">OR</span>
                </div>
              </div>

              {/* Google OAuth Login Option */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:bg-zinc-850 text-gray-700 dark:text-zinc-200 p-2.5 font-bold text-3xs uppercase tracking-wider shadow-4xs transition-all cursor-pointer disabled:opacity-50 mb-4"
              >
                <span className="flex items-center justify-center h-4 w-4 bg-red-500 rounded-full text-white text-5xs font-extrabold font-mono">G</span>
                <span>Continue with Google</span>
              </button>

              {/* Toggle to Sign Up view */}
              <div className="mt-4 text-center">
                <p className="text-3xs text-gray-500 dark:text-zinc-400 font-medium">
                  Don't have an operator profile?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setIsAuthNotAllowedError(false);
                      setAuthMode('signup');
                    }}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                  >
                    Register / Sign Up
                  </button>
                </p>
              </div>

              {/* Quick Demo Pre-fill Details */}
              <div className="mt-5 pt-4 border-t border-gray-50 dark:border-zinc-850 text-center">
                <button
                  id="login-demo-fill-btn"
                  onClick={handleQuickDemo}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 text-4xs font-bold uppercase tracking-wider dark:bg-zinc-850 dark:text-zinc-400 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
                >
                  <KeyRound className="h-3 w-3 text-teal-500" />
                  <span>Use Sandbox Account</span>
                </button>
                <p className="text-4xs text-gray-400 dark:text-zinc-500 mt-2 font-mono">
                  Username: sjenkins@veloracrm.ai | Password: password
                </p>
              </div>
            </>
          )}

          {/* SIGN UP VIEW */}
          {authMode === 'signup' && (
            <>
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3 mb-5 dark:border-zinc-850">
                <Sparkles className="h-4 w-4 text-teal-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 font-sans">
                  Initialize Workspace Profile
                </span>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3.5">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-3xs font-semibold dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/20 animate-fade-in">
                    {error}
                  </div>
                )}

                {/* Name Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1.5 font-mono">
                      First Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <input
                        id="signup-firstname-input"
                        type="text"
                        required
                        value={signUpFirstName}
                        onChange={(e) => setSignUpFirstName(e.target.value)}
                        placeholder="John"
                        disabled={isLoading}
                        className="w-full rounded-xl border border-gray-150 pl-9 p-2.5 text-xs text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1.5 font-mono">
                      Last Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <input
                        id="signup-lastname-input"
                        type="text"
                        required
                        value={signUpLastName}
                        onChange={(e) => setSignUpLastName(e.target.value)}
                        placeholder="Doe"
                        disabled={isLoading}
                        className="w-full rounded-xl border border-gray-150 pl-9 p-2.5 text-xs text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Name (Optional) */}
                <div>
                  <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1.5 font-mono">
                    Business Name <span className="text-gray-350 dark:text-zinc-600 text-5xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <Briefcase className="h-3.5 w-3.5" />
                    </span>
                    <input
                      id="signup-business-input"
                      type="text"
                      value={signUpBusinessName}
                      onChange={(e) => setSignUpBusinessName(e.target.value)}
                      placeholder="Acme Corporation"
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-150 pl-9 p-2.5 text-xs text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1.5 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <input
                      id="signup-email-input"
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-150 pl-9 p-2.5 text-xs text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Password field with strength indicator */}
                <div>
                  <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1.5 font-mono">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <Lock className="h-3.5 w-3.5" />
                    </span>
                    <input
                      id="signup-password-input"
                      type={showSignUpPassword ? "text" : "password"}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-150 pl-9 pr-10 p-2.5 text-xs text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    >
                      {showSignUpPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator visual */}
                  {signUpPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-5xs uppercase tracking-wider font-extrabold font-mono">
                        <span className="text-gray-400 dark:text-zinc-500">Security Strength:</span>
                        <span className={strength.textColor}>{strength.label}</span>
                      </div>
                      <div className="h-1 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden flex gap-0.5">
                        <div className={`h-full ${strength.color} transition-all`} style={{ width: `${Math.max(15, strength.score * 25)}%` }} />
                      </div>
                      <p className="text-4xs text-gray-400 dark:text-zinc-500 font-mono leading-normal">
                        Use uppercase, numbers & symbol combinations.
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1.5 font-mono">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <Lock className="h-3.5 w-3.5" />
                    </span>
                    <input
                      id="signup-confirmpassword-input"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Repeat secure password"
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-150 pl-9 pr-10 p-2.5 text-xs text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Terms and Privacy Policy Required Checkboxes */}
                <div className="space-y-2 pt-1.5">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      id="signup-accept-terms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      disabled={isLoading}
                      className="rounded-xs border-gray-250 text-teal-600 focus:ring-teal-500 h-3.5 w-3.5 mt-0.5 dark:border-zinc-800 dark:bg-zinc-900"
                    />
                    <span className="text-4xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide leading-tight">
                      I accept the <span className="text-teal-600 dark:text-teal-400 hover:underline">Terms & Conditions</span> (Required)
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      id="signup-accept-privacy"
                      type="checkbox"
                      checked={acceptPrivacy}
                      onChange={(e) => setAcceptPrivacy(e.target.checked)}
                      disabled={isLoading}
                      className="rounded-xs border-gray-250 text-teal-600 focus:ring-teal-500 h-3.5 w-3.5 mt-0.5 dark:border-zinc-800 dark:bg-zinc-900"
                    />
                    <span className="text-4xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide leading-tight">
                      I accept the <span className="text-teal-600 dark:text-teal-400 hover:underline">Privacy Policy</span> (Required)
                    </span>
                  </label>
                </div>

                {/* Create Account Submit Button */}
                <button
                  id="signup-submit-button"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white p-2.5 font-bold text-xs shadow-xs transition-all disabled:opacity-50 mt-4 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Initialize Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* OR Divider with visual alignment */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-100 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-4xs uppercase tracking-wider font-extrabold">
                  <span className="bg-white px-2.5 text-gray-400 dark:bg-zinc-900 dark:text-zinc-500 font-mono">OR</span>
                </div>
              </div>

              {/* Google OAuth Register Option */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:bg-zinc-850 text-gray-700 dark:text-zinc-200 p-2.5 font-bold text-3xs uppercase tracking-wider shadow-4xs transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="flex items-center justify-center h-4 w-4 bg-red-500 rounded-full text-white text-5xs font-extrabold font-mono">G</span>
                <span>Continue with Google</span>
              </button>

               {/* Redirect to Sign In link */}
              <div className="mt-5 pt-3 border-t border-gray-50 dark:border-zinc-850 text-center">
                <p className="text-3xs text-gray-500 dark:text-zinc-400 font-medium">
                  Already have an operator account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setIsAuthNotAllowedError(false);
                      setAuthMode('signin');
                    }}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {authMode === 'forgot' && (
            <>
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3 mb-5 dark:border-zinc-850">
                <KeyRound className="h-4 w-4 text-teal-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 font-sans">
                  Reset Secure Passkey
                </span>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-3xs font-semibold dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/20 animate-fade-in">
                    {error}
                  </div>
                )}

                {forgotSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-3xs font-semibold dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/20 animate-fade-in">
                    Password reset link was successfully dispatched! Please check your email inbox and spam folders for instructions.
                  </div>
                )}

                <div>
                  <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1.5 font-mono">
                    Operator Registered Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <input
                      id="forgot-email-input"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="sjenkins@veloracrm.ai"
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-150 pl-9 p-2.5 text-xs text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-60"
                    />
                  </div>
                  <p className="text-4xs text-gray-400 dark:text-zinc-500 mt-2 font-mono leading-normal">
                    Instructions to establish a new passcode will be dispatched to this secure channel.
                  </p>
                </div>

                <button
                  id="forgot-submit-button"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white p-2.5 font-bold text-xs shadow-xs transition-all disabled:opacity-50 mt-4 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Instructions...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Redirect back to Sign In */}
              <div className="mt-5 pt-3 border-t border-gray-50 dark:border-zinc-850 text-center">
                <p className="text-3xs text-gray-500 dark:text-zinc-400 font-medium">
                  Remembered your passkey?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setForgotSuccess(false);
                      setIsAuthNotAllowedError(false);
                      setIsInvalidCredentialError(false);
                      setAuthMode('signin');
                    }}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </p>
              </div>
            </>
          )}

        </div>

        {/* AES Footer notation */}
        <div className="text-center mt-6">
          <span className="text-4xs font-mono text-gray-400 dark:text-zinc-600 uppercase tracking-widest font-semibold">
            Secured via AES-256 Protocol
          </span>
        </div>
      </div>
    </div>
  );
};
